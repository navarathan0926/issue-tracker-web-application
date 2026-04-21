import styled from 'styled-components';

export const TableSection = styled.div`
  display: flex;
  flex-direction: column;
  height: 600px; /* Fixed height as requested */
  background: #fff;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);

  .table-container {
    flex: 1;
    overflow: auto;
    
    /* Ensure the table takes up space even when empty */
    .ant-table-wrapper, .ant-spin-nested-loading, .ant-spin-container, .ant-table {
      height: 100%;
    }
  }

  .pagination-container {
    padding-top: 16px;
    display: flex;
    justify-content: center;
    border-top: 1px solid #f0f0f0;
    background: #fff;
  }
`;
