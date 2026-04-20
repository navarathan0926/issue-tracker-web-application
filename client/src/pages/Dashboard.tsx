import React, { useEffect, useState, useCallback } from 'react';
import { Table, Tag, Space, Button, Input, Select, Drawer, Form, Modal, message, Row, Col, Statistic, Card, Grid } from 'antd';
import { PlusOutlined, SearchOutlined, CheckCircleOutlined, SyncOutlined, ClockCircleOutlined, DownloadOutlined } from '@ant-design/icons';
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

  const screens = Grid.useBreakpoint();

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
    setCurrentIssue(record || null);
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
  
  const handleExport = async () => {
    try {
      setLoading(true);
      const blob = await issueService.exportIssues({
        search: filters.search,
        status: filters.status,
        priority: filters.priority
      });

      const url = URL.createObjectURL(new Blob([blob], { type: 'text/csv;charset=utf-8;' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `issues_export_${moment().format('YYYYMMDD_HHmmss')}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      message.success('Successfully exported issues');
    } catch (error) {
      message.error('Failed to export issues');
    } finally {
      setLoading(false);
    }
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
    <>
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={8}>
          <Card bordered={false} hoverable style={{ background: 'linear-gradient(135deg, #f6ffed 0%, #d9f7be 100%)', borderRadius: '12px' }}>
            <Statistic title="Open Issues" value={stats.open} valueStyle={{ color: '#389e0d', fontWeight: 'bold' }} prefix={<ClockCircleOutlined />} />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card bordered={false} hoverable style={{ background: 'linear-gradient(135deg, #fff7e6 0%, #ffd591 100%)', borderRadius: '12px' }}>
            <Statistic title="In Progress" value={stats.inProgress} valueStyle={{ color: '#d46b08', fontWeight: 'bold' }} prefix={<SyncOutlined spin />} />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card bordered={false} hoverable style={{ background: 'linear-gradient(135deg, #e6f4ff 0%, #91caff 100%)', borderRadius: '12px' }}>
            <Statistic title="Resolved" value={stats.resolved} valueStyle={{ color: '#0958d9', fontWeight: 'bold' }} prefix={<CheckCircleOutlined />} />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} align="middle" style={{ marginBottom: 24 }}>
        <Col xs={24} lg={17}>
          <Row gutter={[12, 12]}>
            <Col xs={24} sm={12} md={10}>
              <Input 
                placeholder="Search issues..." 
                prefix={<SearchOutlined />} 
                onChange={handleSearchChange}
                style={{ width: '100%', height: '40px' }}
                allowClear
              />
            </Col>
            <Col xs={12} sm={6} md={7}>
              <Select
                placeholder="Status"
                style={{ width: '100%', height: '40px' }}
                allowClear
                onChange={(val) => setFilters(prev => ({ ...prev, status: val, page: 1 }))}
              >
                <Option value={IssueStatus.OPEN}>Open</Option>
                <Option value={IssueStatus.IN_PROGRESS}>In Progress</Option>
                <Option value={IssueStatus.RESOLVED}>Resolved</Option>
              </Select>
            </Col>
            <Col xs={12} sm={6} md={7}>
              <Select
                placeholder="Priority"
                style={{ width: '100%', height: '40px' }}
                allowClear
                onChange={(val) => setFilters(prev => ({ ...prev, priority: val, page: 1 }))}
              >
                <Option value={IssuePriority.LOW}>Low</Option>
                <Option value={IssuePriority.MEDIUM}>Medium</Option>
                <Option value={IssuePriority.HIGH}>High</Option>
              </Select>
            </Col>
          </Row>
        </Col>
        
        <Col xs={24} lg={7} style={{ textAlign: screens.lg ? 'right' : 'left' }}>
          <Space 
            size="middle" 
            style={{ width: '100%', justifyContent: screens.lg ? 'flex-end' : 'flex-start' }} 
            direction={screens.xs ? 'vertical' : 'horizontal'}
            wrap
          >
            <Button 
              icon={<DownloadOutlined />} 
              onClick={handleExport}
              loading={loading}
              size="large"
              style={{ borderRadius: '8px' }}
              block={screens.xs}
            >
              Export CSV
            </Button>
            <Button 
              type="primary" 
              icon={<PlusOutlined />} 
              onClick={() => showDrawer('create')}
              size="large"
              style={{ borderRadius: '8px' }}
              block={screens.xs}
            >
              New Issue
            </Button>
          </Space>
        </Col>
      </Row>

      <Table 
        columns={columns} 
        dataSource={issues} 
        rowKey="id" 
        loading={loading}
        scroll={{ x: 800 }}
        pagination={{
          current: filters.page,
          pageSize: filters.limit,
          total: total,
          showSizeChanger: true,
          position: ['bottomCenter']
        }}
        onChange={handleTableChange}
      />

      <Drawer
        title={drawerType === 'create' ? 'Create New Issue' : 'Edit Issue'}
        placement="right"
        width={screens.xs ? '100%' : 400}
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
            <Input placeholder="Enter issue title" size="large" />
          </Form.Item>
          
          <Form.Item name="description" label="Description">
            <TextArea rows={4} placeholder="Enter detailed description" />
          </Form.Item>
          
          <div style={{ display: 'flex', gap: '16px' }}>
            {drawerType === 'edit' && (
              <Form.Item name="status" label="Status" style={{ flex: 1 }}>
                <Select size="large">
                  <Option value={IssueStatus.OPEN}>Open</Option>
                  <Option value={IssueStatus.IN_PROGRESS}>In Progress</Option>
                  <Option value={IssueStatus.RESOLVED}>Resolved</Option>
                </Select>
              </Form.Item>
            )}

            <Form.Item name="priority" label="Priority" initialValue={IssuePriority.MEDIUM} style={{ flex: 1 }}>
              <Select size="large">
                <Option value={IssuePriority.LOW}>Low</Option>
                <Option value={IssuePriority.MEDIUM}>Medium</Option>
                <Option value={IssuePriority.HIGH}>High</Option>
              </Select>
            </Form.Item>
          </div>
        </Form>
      </Drawer>
    </>
  );
};

export default Dashboard;
