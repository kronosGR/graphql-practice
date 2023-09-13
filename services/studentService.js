class StudentService {
  constructor(db) {
    this.client = db.sequelize;
    this.Student = db.Student;
  }

  async get(id) {
    return await this.Student.findOne({
      where: { id: id },
    }).catch((err) => {
      console.log(err);
    });
  }

  async create(FirstName, LastName, SchoolId) {
    return await this.Student.create({
      FirstName,
      LastName,
      SchoolId,
    }).catch(console.log);
  }

  async getAll() {
    return await this.Student.findAll({ where: {} }).catch(console.log);
  }

  async delete(id) {
    return await this.Student.destroy({
      where: { id: id },
    }).catch(console.log);
  }
}

module.exports = StudentService;
