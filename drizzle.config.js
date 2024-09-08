/** @type { import("drizzle-kit").Config } */
export default {
    schema: "./utils/schema.js",
    dialect: 'postgresql',
    dbCredentials: {
      url: 'postgresql://AI_MOCK_owner:yc3XYhOufa6E@ep-bold-hill-a1tjly1x.ap-southeast-1.aws.neon.tech/MockInterview?sslmode=require',
    }
  };   