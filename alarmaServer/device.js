'use strict'

module.exports = function setupDevice (DeviceModel) {


  function findByZone (zones) {
    return DeviceModel.findByAll({
      where:{
        zones
      }
    })
  }

  function findAll () {
    return DeviceModel.findAll()
  }


  async function createOrUpdate (device) {
    const cond = {
      where: {
        uuid: device.uuid
      }
    }

    const existingDevice = await DeviceModel.findOne(cond)

    if (existingDevice) {
      const updated = await DeviceModel.update(device, cond)
      return updated ? DeviceModel.findOne(cond) : existingAgent
    }

    const result = await DeviceModel.create(device)
    return result.toJSON()
  }

  return {
    findByZone,
    findAll,
    createOrUpdate

  }
}
