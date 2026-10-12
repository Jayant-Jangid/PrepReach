const logRoleAssignment = (adminId, targetUserId, newRole) => {
  console.log(`[audit:role] Admin ${adminId} assigned role '${newRole}' to User ${targetUserId} at ${new Date().toISOString()}`);
};

module.exports = { logRoleAssignment };
