const initialState = {
  list: [],
  invoiceLoading: false,
  invoice: null,
  invoiceId: null,
  invoiceNumber: null
};

export default (state = initialState, { type, payload, meta }) => {
  switch (type) {
    case 'LIST_INVOICES_PENDING':
      return { ...state, listError: null };

    case 'LIST_INVOICES_SUCCESS':
      return { ...state, list: payload };

    case 'LIST_INVOICES_FAIL':
      return { ...state, listError: payload };

    case 'GET_INVOICE_PENDING':
      return { ...state,
        invoiceLoading: true,
        getError: null,
        invoice: null,
        invoiceId: meta.invoiceId,
        invoiceNumber: meta.invoiceNumber
      };

    case 'GET_INVOICE_FAIL':
      return { ...state,
        invoiceLoading: false,
        getError: payload,
        invoice: null,
        invoiceId: null
      };

    case 'GET_INVOICE_SUCCESS':
      return { ...state, invoiceLoading: false, invoice: meta.data, invoiceId: null };

    default:
      return state;
  }
};
