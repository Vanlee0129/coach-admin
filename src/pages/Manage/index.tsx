import {
  changeUserInfo,
  createUser,
  getUserImageUrl,
  queryUser,
  uploadUserImage,
} from '@/services/user';
import { getUuid } from '@/utils';
import { UploadOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
import { useAccess } from '@umijs/max';
import type { GetProp, UploadFile, UploadProps } from 'antd';
import {
  Button,
  Form,
  Image,
  Input,
  Modal,
  Select,
  Space,
  Table,
  Upload,
  message,
} from 'antd';
import { useEffect, useState } from 'react';
import { history } from 'umi';

interface TableRecord {
  id: number;
  name: string;
  type: string;
  price: number;
  imageUrl: string;
  status: string;
}

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

const Manage: React.FC = () => {
  const [user, setUser] = useState<any[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const access = useAccess();
  const [form] = Form.useForm();

  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [uploading, setUploading] = useState(false);

  const [isEdit, setIsEdit] = useState(false);

  if (!access.canUse) {
    history.push('/login');
  }

  const typeMap: {
    [key: string]: string;
  } = {
    primary: '初级助教',
    middle: '中级助教',
    senior: '高级助教',
  };

  const queryUserList = async () => {
    const res = await queryUser();
    if (res.success) {
      setUser(res.data || []);
      return;
    }
    setUser([]);
  };

  const changeStatus = async (id: number, status: string) => {
    const res = await changeUserInfo(id, {
      status: status === 'online' ? 'offline' : 'online',
    });
    if (res.success) {
      queryUserList();
    }
  };

  const showEditModal = (record: TableRecord) => {
    setIsEdit(true);
    setShowModal(true);
    form.setFieldsValue(record);
    form.setFieldValue('type', typeMap[record.type]);
  };

  const confirmCreate = async () => {
    const values = form.getFieldsValue();
    const res = await createUser({
      id: values.id,
      name: values.name,
      type: values.type,
      price: values.price,
      imageUrl: values.imageUrl,
      status: values.status,
    });
    if (res.success) {
      setShowModal(false);
      queryUserList();
      form.resetFields();
    }
  };

  const confirmEdit = async () => {
    const values = form.getFieldsValue();
    const res = await changeUserInfo(values.id, values);
    if (res.success) {
      setShowModal(false);
      queryUserList();
      form.resetFields();
    }
  };

  const addUser = async () => {
    setShowModal(true);
    form.setFieldValue('id', user.length + 1);
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => <div>{typeMap[type]}</div>,
    },
    {
      title: '价格',
      dataIndex: 'price',
      key: 'price',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <div>{status === 'online' ? '在线' : '离线'}</div>
      ),
    },
    {
      title: '介绍图片',
      dataIndex: 'imageUrl',
      key: 'imageUrl',
      render: (_: string, record: TableRecord) => (
        <Image
          src={record.imageUrl}
          alt={record.name}
          style={{ width: 50, height: 50 }}
        />
      ),
    },
    {
      title: '操作',
      dataIndex: 'action',
      key: 'action',
      render: (_: string, record: TableRecord) => (
        <Space>
          <Button
            onClick={() => changeStatus(record.id, record.status)}
            type="primary"
          >
            {record.status === 'online' ? '下线' : '上线'}
          </Button>
          <Button type="primary" onClick={() => showEditModal(record)}>
            编辑
          </Button>
        </Space>
      ),
    },
  ];

  const handleUpload = async (file: File) => {
    const formData = new FormData();
    fileList.forEach((file) => {
      formData.append('files[]', file as FileType);
    });
    setUploading(true);
    // You can use any AJAX library you like
    const uuid = getUuid();
    const res = await uploadUserImage(uuid, file);
    if (res.success) {
      const result = await getUserImageUrl(
        `${res.data?.fullPath?.split('/')[1]}` || '',
      );
      const imageUrl = result?.data?.signedUrl;
      if (imageUrl) {
        message.success('上传成功');
        setFileList([]);
        setUploading(false);
        form.setFieldValue('imageUrl', imageUrl);
      }
    } else {
      setUploading(false);
      message.error('上传失败');
    }
  };

  const props: UploadProps = {
    onRemove: (file) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
    },
    beforeUpload: (file) => {
      setFileList([...fileList, file]);
      handleUpload(file);
      return false;
    },
    fileList,
    maxCount: 1,
  };

  useEffect(() => {
    queryUserList();
  }, []);

  return (
    <PageContainer ghost>
      <Button
        type="primary"
        onClick={() => addUser()}
        style={{ marginBottom: 16 }}
      >
        新增助教
      </Button>
      <Table
        dataSource={user}
        columns={columns}
        rowKey="id"
        pagination={{
          pageSize: 8,
        }}
      />
      <Modal
        title={isEdit ? '编辑助教' : '新增助教'}
        open={showModal}
        onCancel={() => {
          setShowModal(false);
          form.resetFields();
          setFileList([]);
          setIsEdit(false);
        }}
        onOk={isEdit ? confirmEdit : confirmCreate}
      >
        <Form form={form}>
          <Form.Item label="编号" name="id">
            <Input disabled />
          </Form.Item>
          <Form.Item label="姓名" name="name">
            <Input />
          </Form.Item>
          <Form.Item label="类型" name="type">
            <Select defaultValue={form.getFieldValue('type')}>
              <Select.Option value="primary">初级助教</Select.Option>
              <Select.Option value="middle">中级助教</Select.Option>
              <Select.Option value="senior">高级助教</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="价格" name="price">
            <Input />
          </Form.Item>
          <Form.Item label="状态" name="status">
            <Select defaultValue={form.getFieldValue('status')}>
              <Select.Option value="online">在线</Select.Option>
              <Select.Option value="offline">离线</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="介绍图片" name="imageUrl">
            <Upload {...props}>
              <Button icon={<UploadOutlined />} loading={uploading}>
                上传图片
              </Button>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
    </PageContainer>
  );
};

export default Manage;
