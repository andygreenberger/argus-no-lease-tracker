// Storage wrapper - uses localStorage for deployed app
export const storage = {
  async get(key) {
    try {
      const val = localStorage.getItem(key);
      if (val === null) throw new Error('Not found');
      return { key, value: val };
    } catch { throw new Error('Not found'); }
  },
  async set(key, value) {
    localStorage.setItem(key, value);
    return { key, value };
  },
  async delete(key) {
    localStorage.removeItem(key);
    return { key, deleted: true };
  }
};
