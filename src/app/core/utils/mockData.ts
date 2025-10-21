export const mockUsers = {
  admin: {
    id: "1",
    attributes: {
      type: "admin",
      email: "admin@example.com",
      first_name: "Admin",
      last_name: "User",
    },
    relationships: {
      roles: [
        {
          attributes: { type: "admin" },
          relationships: {
            permissions: [
              { attributes: { name: "organization.update" } },
              { attributes: { name: "user.view" } },
              { attributes: { name: "user.update" } },
            ],
          },
        },
      ],
    },
  },
  user: {
    id: "2",
    attributes: {
      type: "user",
      email: "user@example.com",
      first_name: "Regular",
      last_name: "User",
    },
    relationships: {
      roles: [
        {
          attributes: { type: "user" },
          relationships: {
            permissions: [{ attributes: { name: "member.view" } }],
          },
        },
      ],
    },
  },
  staff: {
    id: "3",
    attributes: {
      type: "user",
      email: "staff@example.com",
      first_name: "Staff",
      last_name: "Member",
    },
    relationships: {
      roles: [
        {
          attributes: { type: "user" },
          relationships: {
            permissions: [
              { attributes: { name: "member.view" } },
              { attributes: { name: "member.create" } },
              { attributes: { name: "member.update" } },
            ],
          },
        },
      ],
    },
  },
};
