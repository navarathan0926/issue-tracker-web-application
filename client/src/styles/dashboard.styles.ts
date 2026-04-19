import styled from 'styled-components';
import { Input, Button, Card, Select, Tag } from 'antd';

// ---------- Stat Cards ----------
export const StatCard = styled(Card)<{ $bg: string }>`
  background: ${({ $bg }) => $bg};
`;

export const StatsRow = styled.div`
  margin-bottom: 24px;
`;

// ---------- Toolbar ----------
export const Toolbar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

// ---------- Search / Filters ----------
export const SearchInput = styled(Input)`
  width: 250px;
`;

export const FilterSelect = styled(Select)`
  width: 150px;
` as typeof Select;

// ---------- Table link buttons ----------
export const LinkButton = styled(Button)`
  padding: 0;
`;

// ---------- Pill Tag ----------
export const RoundedTag = styled(Tag)`
  border-radius: 4px;
`;

// ---------- Title link in table ----------
export const IssueTitleLink = styled.a`
  font-weight: 500;
`;
