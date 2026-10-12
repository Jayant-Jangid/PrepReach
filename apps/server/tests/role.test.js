const assert = require('assert');
const { requireRole } = require('../src/middleware/role.middleware');

const req = { user: { id: 'i1', role: 'instructor' } };
const res = {
  status: (code) => ({
    json: (payload) => {
      assert.strictEqual(code, 403);
      console.log('Test passed: Instructor access rejected on admin route');
    }
  })
};

const middleware = requireRole('admin');
middleware(req, res, () => assert.fail('Should not call next'));
