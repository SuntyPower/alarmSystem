'use strict'

module.exports = function setupDevice (DeviceModel) {


  function findZones (zones) {
    return DeviceModel.findByAll({
      where:{
        zones
      }
    })
  }

  function findByVersion (version) {
    return DeviceModel.findByAll({
      where:{
        version
      }
    })
  }

  function findByState (state) {
    return DeviceModel.findByAll({
      where:{
        state
      }
    })
  }


  function findAll () {
    return DeviceModel.findAll()
  }


  async function update (device) {
    const cond = {
      where: {
        uuid: device.uuid
      }
    }

    const existingDevice = await DeviceModel.findOne(cond)

    if (existingDevice) {
      const updated = await DeviceModel.update(device, cond)
      return updated ? DeviceModel.findOne(cond) : existingDevice

  }}

async function create(device) {
    const result = await DeviceModel.create(device)
    return result.toJSON()
  }


  function findByUuid(uuid) {
    return DeviceModel({
      where:{
      uuid
    }})

  }


  return {
    findZones,
    findByVersion,
    findByState,
    findAll,
    update,
    findByUuid,
    create
  }
}
