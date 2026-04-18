import React, { useEffect, useState, useCallback } from 'react';
import { Table, Tag, Space, Button, Input, Select, Drawer, Form, Modal, message, Row, Col, Statistic, Card } from 'antd';
import { PlusOutlined, SearchOutlined, CheckCircleOutlined, SyncOutlined, ClockCircleOutlined } from '@ant-design/icons';
import debounce from 'lodash/debounce'; // We need to install lodash or use simple debounce
import api from '../services/api';
import moment from 'moment';

const { Option } = Select;
const { TextArea } = Input;

const STATUS_COLORS: Record<string, string> = {
  OPEN: 'blue',
  IN_PROGRESS: 'orange',
  RESOLVED: 'green',
};

const PRIORITY_COLORS: Record<string, string> = {
  LOW: 'green',
  MEDIUM: 'orange',
  HIGH: 'red',
};

const Dashboard: React.FC = () => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [stats, setStats] = useState({ open: 0, inProgress: 0, resolved: 0 });
  const [openDrawer, setOpenDrawer] = useState(false);
  const [drawerType, setDrawerType] = useState<'create' | 'edit'>('create');
  const [currentIssue, setCurrentIssue] = useState<any>(null);
  
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    priority: '',
    page: 1,
    limit: 10
  });

  const [form] = Form.useForm();

  const fetchIssues = async (currentFilters: any) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (currentFilters.search) params.append('search', currentFilters.search);
      if (currentFilters.status) params.append('status', currentFilters.status);
      if (currentFilters.priority) params.append('priority', currentFilters.priority);
      params.append('page', currentFilters.page.toString());
      params.append('limit', currentFilters.limit.toString());

      const res = await api.get(`/issues?${params.toString()}`);
      setIssues(res.data.data.issues);
      setTotal(res.data.data.total);
      
      const statsData = res.data.data.stats || [];
      const newStats = { open: 0, inProgress: 0, resolved: 0 };
      statsData.forEach((s: any) => {
        if (s.status === 'OPEN') newStats.open = s.count;
        if (s.status === 'IN_PROGRESS') newStats.inProgress = s.count;
        if (s.status === 'RESOLVED') newStats.resolved = s.count;
      });
      setStats(newStats);
    } catch (error) {
      message.error('Failed to fetch issues');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIssues(filters);
  }, [filters.page, filters.limit, filters.status, filters.priority]);

  // Debounce search
  const debouncedSearch = useCallback(
    debounce((value: string) => {
      setFilters(prev => ({ ...prev, search: value, page: 1 }));
      fetchIssues({ ...filters, search: value, page: 1 });
    }, 500),
    [filters]
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    debouncedSearch(e.target.value);
  };

  const handleTableChange = (pagination: any) => {
    setFilters(prev => ({
      ...prev,
      page: pagination.current,
      limit: pagination.pageSize
    }));
  };

  const showDrawer = (type: 'create' | 'edit', record?: any) => {
    setDrawerType(type);
    setCurrentIssue(record);
    if (type === 'edit' && record) {
      form.setFieldsValue({
        title: record.title,
        description: record.description,
        status: record.status,
        priority: record.priority
      });
    } else {
      form.resetFields();
    }
    setOpenDrawer(true);
  };

  const closeDrawer = () => {
    setOpenDrawer(false);
    setCurrentIssue(null);
    form.resetFields();
  };

  const onSave = async (values: any) => {
    try {
      setLoading(true);
      if (drawerType === 'create') {
        await api.post('/issues', values);
        message.success('Issue created successfully');
      } else {
        await api.put(`/issues/${currentIssue.id}`, values);
        message.success('Issue updated successfully');
      }
      closeDrawer();
      fetchIssues(filters);
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Failed to save issue');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id: number) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this issue?',
      content: 'This action cannot be undone.',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk: async () => {
        try {
          await api.delete(`/issues/${id}`);
          message.success('Issue deleted');
          fetchIssues(filters);
        } catch (error) {
          message.error('Failed to delete issue');
        }
      }
    });
  };

  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      render: (text: string, record: any) => (
        <a onClick={() => showDrawer('edit', record)} style={{ fontWeight: 500 }}>
          {text}
        </a>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={STATUS_COLORS[status]} style={{ borderRadius: 4 }}>
          {status.replace('_', ' ')}
        </Tag>
      ),
    },
    {
      title: 'Priority',
      dataIndex: 'priority',
      key: 'priority',
      render: (priority: string) => (
        <Tag color={PRIORITY_COLORS[priority]} style={{ borderRadius: 4 }}>
          {priority}
        </Tag>
      ),
    },
    {
      title: 'Created At',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (date: string) => moment(date).format('MMM Do, YYYY'),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: any) => (
        <Space size="middle">
          <Button type="link" onClick={() => showDrawer('edit', record)} style={{ padding: 0 }}>Edit</Button>
          <Button type="link" danger onClick={() => handleDelete(record.id)} style={{ padding: 0 }}>Delete</Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={8}>
          <Card bordered={false} style={{ background: '#f6ffed' }}>
            <Statistic title="Open Issues" value={stats.open} valueStyle={{ color: '#52c41a' }} prefix={<ClockCircleOutlined />} />
          </Card>
        </Col>
        <Col span={8}>
          <Card bordered={false} style={{ background: '#fff7e6' }}>
            <Statistic title="In Progress" value={stats.inProgress} valueStyle={{ color: '#fa8c16' }} prefix={<SyncOutlined spin />} />
          </Card>
        </Col>
        <Col span={8}>
          <Card bordered={false} style={{ background: '#e6f4ff' }}>
            <Statistic title="Resolved" value={stats.resolved} valueStyle={{ color: '#1677ff' }} prefix={<CheckCircleOutlined />} />
          </Card>
        </Col>
      </Row>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16, alignItems: 'center' }}>
        <Space size="middle">
          <Input 
            placeholder="Search issues..." 
            prefix={<SearchOutlined />} 
            onChange={handleSearchChange}
            style={{ width: 250 }}
            allowClear
          />
          <Select
            placeholder="Filter by Status"
            style={{ width: 150 }}
            allowClear
            onChange={(val) => setFilters(prev => ({ ...prev, status: val, page: 1 }))}
          >
            <Option value="OPEN">Open</Option>
            <Option value="IN_PROGRESS">In Progress</Option>
            <Option value="RESOLVED">Resolved</Option>
          </Select>
          <Select
            placeholder="Filter by Priority"
            style={{ width: 150 }}
            allowClear
            onChange={(val) => setFilters(prev => ({ ...prev, priority: val, page: 1 }))}
          >
            <Option value="LOW">Low</Option>
            <Option value="MEDIUM">Medium</Option>
            <Option value="HIGH">High</Option>
          </Select>
        </Space>
        
        <Button type="primary" icon={<PlusOutlined />} onClick={() => showDrawer('create')}>
          New Issue
        </Button>
      </div>

      <Table 
        columns={columns} 
        dataSource={issues} 
        rowKey="id" 
        loading={loading}
        pagination={{
          current: filters.page,
          pageSize: filters.limit,
          total: total,
          showSizeChanger: true,
        }}
        onChange={handleTableChange}
      />

      <Drawer
        title={drawerType === 'create' ? 'Create New Issue' : 'Edit Issue'}
        placement="right"
        width={400}
        onClose={closeDrawer}
        open={openDrawer}
        extra={
          <Space>
            <Button onClick={closeDrawer}>Cancel</Button>
            <Button onClick={() => form.submit()} type="primary" loading={loading}>
              Save
            </Button>
          </Space>
        }
      >
        <Form layout="vertical" form={form} onFinish={onSave}>
          <Form.Item name="title" label="Title" rules={[{ required: true, message: 'Please enter issue title' }]}>
            <Input placeholder="Enter issue title" />
          </Form.Item>
          
          <Form.Item name="description" label="Description">
            <TextArea rows={4} placeholder="Enter detailed description" />
          </Form.Item>
          
          {drawerType === 'edit' && (
            <Form.Item name="status" label="Status">
              <Select>
                <Option value="OPEN">Open</Option>
                <Option value="IN_PROGRESS">In Progress</Option>
                <Option value="RESOLVED">Resolved</Option>
              </Select>
            </Form.Item>
          )}

          <Form.Item name="priority" label="Priority" initialValue="MEDIUM">
            <Select>
              <Option value="LOW">Low</Option>
              <Option value="MEDIUM">Medium</Option>
              <Option value="HIGH">High</Option>
            </Select>
          </Form.Item>
        </Form>
      </Drawer>
    </div>
  );
};

export default Dashboard;
