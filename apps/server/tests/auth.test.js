const assert = require('assert');
const { requireRole } = require('../src/middleware/role.middleware');

const req = { user: { id: 'u1', role: 'student' } };
const res = {
  status: (code) => ({
    json: (payload) => {
      assert.strictEqual(code, 403);
      console.log('Test passed: Student access rejected on admin route');
    }
  })
};

const middleware = requireRole('admin');
middleware(req, res, () => assert.fail('Should not call next'));
