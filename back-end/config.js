const dotenv = require("dotenv");
dotenv.config();
module.exports = {
  projectinfo: process.env.PROJECTINFORMATION,
  sprints: process.env.SPRINTCOLLECTION,
  userstories: process.env.USERSTORYCOLLECTION,
  subtasks: process.env.SUBTASKSCOLLCTION,
  teammembers: process.env.TEAMMEMBERSCOLLECTION,
  backlogs: process.env.BACKLOGCOLLECION,
  retrospectives: process.env.RETROSPECTIVECOLLECTION,
  atlas: process.env.DBURL,
  appdb: process.env.DB,
  port: process.env.PORT,
  graphql: process.env.GRAPHQLURL,
};
