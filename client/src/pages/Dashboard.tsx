import React, { useEffect, useState, useCallback } from 'react';
import { Table, Tag, Space, Button, Input, Select, Drawer, Form, Modal, message, Row, Col, Statistic, Card } from 'antd';
import { PlusOutlined, SearchOutlined, CheckCircleOutlined, SyncOutlined, ClockCircleOutlined } from '@ant-design/icons';
import debounce from 'lodash/debounce';
import { issueService } from '../services/issueService';
import { type Issue, IssueStatus, IssuePriority, type IssueFilters } from '../types';
import moment from 'moment';

const { Option } = Select;
const { TextArea } = Input;

const STATUS_COLORS: Record<IssueStatus, string> = {
  [IssueStatus.OPEN]: 'blue',
  [IssueStatus.IN_PROGRESS]: 'orange',
  [IssueStatus.RESOLVED]: 'green',
};

const PRIORITY_COLORS: Record<IssuePriority, string> = {
  [IssuePriority.LOW]: 'green',
  [IssuePriority.MEDIUM]: 'orange',
  [IssuePriority.HIGH]: 'red',
};

const Dashboard: React.FC = () => {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [stats, setStats] = useState({ open: 0, inProgress: 0, resolved: 0 });
  const [openDrawer, setOpenDrawer] = useState(false);
  const [drawerType, setDrawerType] = useState<'create' | 'edit'>('create');
  const [currentIssue, setCurrentIssue] = useState<Issue | null>(null);
  
  const [filters, setFilters] = useState<IssueFilters>({
    search: '',
    status: '',
    priority: '',
    page: 1,
    limit: 10
  });

  const [form] = Form.useForm();

  const fetchIssues = async (currentFilters: IssueFilters) => {
    setLoading(true);
    try {
      const data = await issueService.getIssues(currentFilters);
      setIssues(data.issues);
      setTotal(data.total);
      
      const statsData = data.stats || [];
      const newStats = { open: 0, inProgress: 0, resolved: 0 };
      statsData.forEach((s) => {
        if (s.status === IssueStatus.OPEN) newStats.open = s.count;
        if (s.status === IssueStatus.IN_PROGRESS) newStats.inProgress = s.count;
        if (s.status === IssueStatus.RESOLVED) newStats.resolved = s.count;
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
      page: pagination.current || 1,
      limit: pagination.pageSize || 10
    }));
  };

  const showDrawer = (type: 'create' | 'edit', record?: Issue) => {
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

  const onSave = async (values: Partial<Issue>) => {
    try {
      setLoading(true);
      if (drawerType === 'create') {
        await issueService.createIssue(values);
        message.success('Issue created successfully');
      } else if (currentIssue) {
        await issueService.updateIssue(currentIssue.id, values);
        message.success('Issue updated successfully');
      }
      closeDrawer();
      fetchIssues(filters);
    } catch (error: Error | unknown) {
      const msg = (error as any)?.response?.data?.message || 'Failed to save issue';
      message.error(msg);
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
          await issueService.deleteIssue(id);
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
      render: (text: string, record: Issue) => (
        <a onClick={() => showDrawer('edit', record)} style={{ fontWeight: 500 }}>
          {text}
        </a>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: IssueStatus) => (
        <Tag color={STATUS_COLORS[status]} style={{ borderRadius: 4 }}>
          {status.replace('_', ' ')}
        </Tag>
      ),
    },
    {
      title: 'Priority',
      dataIndex: 'priority',
      key: 'priority',
      render: (priority: IssuePriority) => (
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
      render: (_: unknown, record: Issue) => (
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
            <Option value={IssueStatus.OPEN}>Open</Option>
            <Option value={IssueStatus.IN_PROGRESS}>In Progress</Option>
            <Option value={IssueStatus.RESOLVED}>Resolved</Option>
          </Select>
          <Select
            placeholder="Filter by Priority"
            style={{ width: 150 }}
            allowClear
            onChange={(val) => setFilters(prev => ({ ...prev, priority: val, page: 1 }))}
          >
            <Option value={IssuePriority.LOW}>Low</Option>
            <Option value={IssuePriority.MEDIUM}>Medium</Option>
            <Option value={IssuePriority.HIGH}>High</Option>
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
                <Option value={IssueStatus.OPEN}>Open</Option>
                <Option value={IssueStatus.IN_PROGRESS}>In Progress</Option>
                <Option value={IssueStatus.RESOLVED}>Resolved</Option>
              </Select>
            </Form.Item>
          )}

          <Form.Item name="priority" label="Priority" initialValue={IssuePriority.MEDIUM}>
            <Select>
              <Option value={IssuePriority.LOW}>Low</Option>
              <Option value={IssuePriority.MEDIUM}>Medium</Option>
              <Option value={IssuePriority.HIGH}>High</Option>
            </Select>
          </Form.Item>
        </Form>
      </Drawer>
    </div>
  );
};

export default Dashboard;
