'use strict'

module.exports = function setupReport (DeviceModel , ReportModel) {



  async function findByDeviceUuid (uuid) {
      return ReportModel.findAll({
        attributes: [ 'type' ],
        group: [ 'type' ],
        include: [{
          attributes: [],
          model: DeviceModel,
          where: {
            uuid
          }
        }],
        raw: true
      })
    }


      //ultimas 20 reports  de la alarma
    async function findByTypeDeviceUuid (type, uuid) {
      return ReportModel.findAll({
        attributes: [ 'id', 'type', 'zone','events', 'createdAt' ],
        where: {
          type
        },
        limit: 20,
        order: [[ 'createdAt', 'DESC' ]],
        include: [{
          attributes: [],
          model: DeviceModel,
          where: {
            uuid
          }
        }],
        raw: true
      })
    }



    async function create (uuid, report) {
      console.log(uuid, report);
      const device = await DeviceModel.findOne({
        where: { uuid }
      }).catch((err) => {console.log(err)})
      if (device) {
        Object.assign(report, { deviceId: device.id })
        const result = await ReportModel.create(report)
        return result.toJSON()
      }
    }

      function findAll () {
        return ReportModel.findAll()
      }

    return {
      create,
      findByDeviceUuid,
      findByTypeDeviceUuid,
      findAll
    }
  }
