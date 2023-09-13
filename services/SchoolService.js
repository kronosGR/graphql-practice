class SchoolService {
  constructor(db) {
    this.client = db.sequelize;
    this.School = db.School;
  }

  async create(Name, Address, Description) {
    return await this.School.create({
      Name,
      Address,
      Description,
    }).catch(console.log);
  }

  async get(id) {
    return await this.School.findOne({
      where: { id: id },
    }).catch(console.log);
  }

  async getAll() {
    return await this.School.findAll({
      where: {},
    }).catch(console.log);
  }

  async delete(id) {
    return await this.School.destroy({
      where: { id: id },
    }).catch(console.log);
  }
}

module.exports = SchoolService;
