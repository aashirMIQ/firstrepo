export const ORDER_LINES_SCHEMA = "ORDER_LINES";
export const ORDER_SCHEMA = "ORDER";
export const CUSTOMER_SCHEMA = "CUSTOMER";
export const JOURNAL_SCHEMA = "JOURNAL";
export const PRODUCT_SCHEMA = "PRODUCT";
export const SESSION_SCHEMA = "SESSION"
export const MONEY_IN_SCHEMA = "MONEY_IN"
export const MONEY_OUT_SCHEMA = "MONEY_OUT"
export const USER_SCHEMA = "USERS"
export const PAYMENT_SCHEMA = "PAYMENT"

// data types for realm bool , int , float , double , string , data , and date

export const UserSchema = {
  name: USER_SCHEMA,
  primaryKey: "id",
  properties: {
    id: "string",
    name: "string",
    password: "string",
    phone_number: 'string'
  }
}

export const CustomerSchema = {
  name: CUSTOMER_SCHEMA,
  primaryKey: "id",
  properties: {
    id: "string",
    user_id: 'string',
    name: "string",
    phone: "string",
    email: "string",
    address: "string",
    total_outstanding_payment: 'float',
    loyalty_points: 'int',

  }
}
export const PrdouctSchema = {
  name: PRODUCT_SCHEMA,
  primaryKey: 'id',
  properties: {
    id: "int",
    allow_custom_price: { type: "bool", optional: true, default: false },
    barcode: "string",
    default_code: { type: "bool", optional: true, default: false },
    description: { type: "bool", optional: true, default: false },
    description_sale: { type: "bool", optional: true, default: false },
    display_name: "string",
    item_code: "string",
    kitchen_code: { type: "bool", optional: true, default: false },
    list_price: "int",
    standard_price: "int",
    pos_categ_id: { type: "bool", optional: true, default: false },
    price: "int",
    product_modifiers: { type: 'list', objectType: 'string', optional: true },
    taxes_id: { type: 'list', objectType: 'string', optional: true },
    to_weight: { type: "bool", optional: true, default: false },
    tracking: { type: "string", optional: true, default: '' },
    open_item: { type: 'bool', optional: true, default: false },
    discount_item: { type: 'bool', optional: true, default: false },
  }
}

export const OrderLinesSchema = {
  name: ORDER_LINES_SCHEMA,
  primaryKey: "id",
  properties: {
    id: "string",
    order_id: 'string',
    note: { type: 'string', optional: true },
    discount_note: { type: 'string', optional: true },
    product_id: 'int',
    price_unit: 'int',
    cost_price: 'int',
    qty: 'int',
    isVoid: { type: 'bool', default: false },
    discount: 'int',
    pack_lot_ids: { type: 'list', objectType: 'string', optional: true },
    tax_ids: { type: 'list', objectType: 'string', optional: true },
  }
};

export const JournalSchema = {
  name: JOURNAL_SCHEMA,
  primaryKey: 'id',
  properties: {
    id: "int",
    journal_id: "int",
    name: "string",
    account_id: "int",


  }
};



export const OrderSchema = {
  name: ORDER_SCHEMA,
  primaryKey: 'id',
  // primaryKey: "sequence_number",
  properties: {
    id: "string",
    user_id: "string",
    pos_session_id: "string",
    to_invoice: { type: "bool", default: false },
    name: "string",
    partner_id: "string",
    amount_paid: "float",
    creation_date: "date",
    amount_tax: "float",
    amount_return: "int",
    // sequence_number: "int",
    amount_total: "float",
    lines: { type: 'list', objectType: ORDER_LINES_SCHEMA, },
    // statement_ids: { type: 'list', objectType: JOURNAL_SCHEMA },
    account_id: { type: 'int', optional: true },
    statement_id: { type: 'int', optional: true },
    journal_id: { type: 'int', optional: true },
    amount: { type: 'int', optional: true },
  }
};

export const SessionSchema = {
  name: SESSION_SCHEMA,
  primaryKey: 'id',
  properties: {
    id: 'string',
    user_id: 'string',
    state: 'string',
    start_at: 'date',
    stop_at: { type: 'date', default: null, optional: true },
    cash_register_balance_start: { type: 'float', default: 0, optional: true },
    cash_register_balance_end: { type: 'float', default: 0, optional: true },
    cash_register_balance_end_real: { type: 'float', default: 0, optional: true },
    cash_register_difference: { type: 'float', default: 0, optional: true },
    no_of_transactions: { type: 'int', default: 0, optional: true },
    no_of_customers: { type: 'int', default: 0, optional: true },
    total_money_in_amount: { type: 'int', default: 0, optional: true },
    total_money_out_amount: { type: 'int', default: 0, optional: true },
    money_in: { type: 'list', objectType: MONEY_IN_SCHEMA, },
    money_out: { type: 'list', objectType: MONEY_OUT_SCHEMA, },
    total_transactions_amount: { type: 'float', default: 0, optional: true },
    total_amount_paid: { type: 'float', default: 0, optional: true },
    total_outstanding_amount: { type: 'float', default: 0, optional: true },
  }
}

export const MoneyInSchema = {
  name: MONEY_IN_SCHEMA,
  primaryKey: 'id',
  properties: {
    id: 'string',
    user_id: 'string',
    pos_session_id: 'string',
    amount: 'int',
    reason: 'string'
  }
}

export const MoneyOutSchema = {
  name: MONEY_OUT_SCHEMA,
  primaryKey: 'id',
  properties: {
    id: 'string',
    user_id: 'string',
    pos_session_id: 'string',
    amount: 'int',
    reason: 'string'
  }
}


export const PaymentSchema = {
  name: PAYMENT_SCHEMA,
  primaryKey: 'id',
  properties: {
    id: 'string',
    customer_id: 'string',
    user_id: 'string',
    amount: 'float',
    date: 'date',
    payment_mode: 'string',
  }
}

export const databaseOpt = {
  path: "oscar_pos.realm",
  schema: [OrderSchema, OrderLinesSchema, CustomerSchema, JournalSchema, PrdouctSchema, SessionSchema,
    MoneyInSchema, MoneyOutSchema, UserSchema, PaymentSchema],
  schemaVersion: 1
};