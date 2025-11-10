export default class Order {
  constructor(orderId, customerId, items, total) {
    this._orderId = orderId;
    this._customerId = customerId;
    this._items = items; // array of {code, name, price, qty, total}
    this._total = total;
    this._date = new Date().toLocaleString();
  }

  get orderId() { return this._orderId; }
  get customerId() { return this._customerId; }
  get items() { return this._items; }
  get total() { return this._total; }
  get date() { return this._date; }
}
