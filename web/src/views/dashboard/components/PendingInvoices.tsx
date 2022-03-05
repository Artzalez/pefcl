import styled from '@emotion/styled';
import { Dialog, Stack } from '@mui/material';
import calendar from 'dayjs/plugin/calendar';
import relative from 'dayjs/plugin/relativeTime';
import dayjs from 'dayjs';
import { useAtom } from 'jotai';
import React, { useState } from 'react';
import { BodyText } from '../../../components/ui/Typography/BodyText';
import { Heading6 } from '../../../components/ui/Typography/Headings';
import { useConfig } from '../../../hooks/useConfig';
import { formatMoney } from '../../../utils/currency';
import theme from '../../../utils/theme';
import { pendingInvoicesAtom } from '../../../data/invoices';
import { Invoice } from '../../../../../typings/Invoice';
import { useTranslation } from 'react-i18next';
import Button from '../../../components/ui/Button';
import PayInvoiceModal from '../../../components/Modals/PayInvoice/PayInvoice';

dayjs.extend(calendar);
dayjs.extend(relative);

const ExpireDate = styled(Heading6)`
  font-weight: ${theme.typography.fontWeightLight};
`;

const From = styled(BodyText)`
  font-weight: ${theme.typography.fontWeightBold};
  white-space: pre;
  text-overflow: ellipsis;
  max-width: 14rem;
  overflow: hidden;
`;

const Message = styled(BodyText)`
  color: ${theme.palette.text.secondary};
`;

const ExpiresAndButton = styled.div`
  display: flex;
  justify-content: space-between;
  padding: ${theme.spacing(1.5)} 0;
  border-bottom: 1px solid ${theme.palette.background.light8};
`;

const InvoiceItem: React.FC<{ invoice: Invoice }> = ({ invoice, ...props }) => {
  const { message, amount, id, createdAt, expiresAt, from } = invoice;
  const { t } = useTranslation();
  const config = useConfig();
  const expiresDate = dayjs.unix(parseInt(expiresAt, 10));
  const createdDate = dayjs.unix(parseInt(createdAt, 10));
  const [isPayOpen, setIsPayOpen] = useState(false);

  const handleCloseModal = () => {
    setIsPayOpen(false);
  };

  return (
    <div {...props} key={id}>
      <Dialog open={isPayOpen} onClose={handleCloseModal} maxWidth="md" fullWidth>
        <PayInvoiceModal onCancel={handleCloseModal} invoice={invoice} />
      </Dialog>

      <Stack spacing={0}>
        <Stack flexDirection="row" justifyContent="space-between">
          <From>{from}</From>
          <BodyText>{formatMoney(amount, config)}</BodyText>
        </Stack>

        <Stack flexDirection="row" justifyContent="space-between">
          <Message>{message}</Message>
          <ExpireDate>{createdDate.fromNow()}</ExpireDate>
        </Stack>

        <ExpiresAndButton>
          <Stack>
            <Heading6>{t('Expires')}</Heading6>
            <ExpireDate>{expiresDate.calendar()}</ExpireDate>
          </Stack>
          <Button onClick={() => setIsPayOpen(true)}>{t('Pay invoice')}</Button>
        </ExpiresAndButton>
      </Stack>
    </div>
  );
};

const PendingInvoices: React.FC = () => {
  const [invoices] = useAtom(pendingInvoicesAtom);

  return (
    <Stack spacing={2}>
      {invoices.map((invoice) => (
        <InvoiceItem key={invoice.id} invoice={invoice} />
      ))}
    </Stack>
  );
};

export default PendingInvoices;
