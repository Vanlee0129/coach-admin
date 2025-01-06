import { queryOnlineUser } from '@/services/user';
import { PageContainer } from '@ant-design/pro-components';
import { Card, Col, Row } from 'antd';
import { useEffect, useState } from 'react';
import { history, useAccess } from 'umi';

const HomePage: React.FC = () => {
  const access = useAccess();
  const [onlineUser, setOnlineUser] = useState<any[]>([]);

  if (!access.canUse) {
    history.push('/login');
  }

  useEffect(() => {
    queryOnlineUser().then((res) => {
      if (res.success) {
        setOnlineUser(res.data || []);
      }
    });
  }, []);

  return (
    <PageContainer ghost>
      <Row gutter={[16, 16]}>
        <Col span={8}>
          <Card title="今日在线人数" loading={!onlineUser.length}>
            <h1>{onlineUser.length}</h1>
          </Card>
        </Col>
        <Col span={8}>
          {/* <Card title="今日订单量" loading={!onlineUser.length}>
            <h1>100</h1>
          </Card> */}
        </Col>
        <Col span={8}>
          {/* <Card title="今日流水" loading={!onlineUser.length}>
            <h1>¥ 10000</h1>
          </Card> */}
        </Col>
      </Row>
    </PageContainer>
  );
};

export default HomePage;
