level = require 'level'
levelws = require 'level-ws'

db = levelws level "#{__dirname}/../db"

module.exports = 
  # get(id, callback)
  # Get metrics 
  # - id: metric's id 
  # - callback: the callback function, callback(err, data)
  get: (callback) ->
#    callback(null)
    res = []
    rs = db.createReadStream()

    # on data and if correct id, add the data to the result array
    rs.on 'data', (data) ->
      [ ..., dataId, dataTimestamp ] = data.key.split ":"
      # if corresponding id
# push new object with id, timestamp and value properties
      res.push
        id: dataId
        timestamp: dataTimestamp
        value: data.value

    rs.on 'error', (err) -> callback err

    # on stream end, return the result
    rs.on 'end', () -> callback null, res

  getbyid: (id, callback) ->
# result array
    res = []
    rs = db.createReadStream()
    console.log(id)
    # on data and if correct id, add the data to the result array
    rs.on 'data', (data) ->
      [ ..., dataId, dataTimestamp ] = data.key.split ":"
      # if corresponding id
      if dataId == id
# push new object with id, timestamp and value properties
        res.push
          id: dataId
          timestamp: dataTimestamp
          value: data.value

    rs.on 'error', (err) -> callback err

    # on stream end, return the result
    rs.on 'end', () ->
      callback null, res

# read

#  deletebyid: (id, callback) ->


  # save(id, metrics, callback)
  # Save given metrics 
  # - id: metric id
  # - metrics: an array of { timestamp, value }
  # - callback: the callback function
  save: (id, metrics, callback) -> 
    ws = db.createWriteStream()
    ws.on 'error', callback 
    ws.on 'close', callback
    console.log(id)
    for metric in metrics 
      { timestamp, value } =  metric
      ws.write 
        key: "metrics:#{id}:#{timestamp}"
        value: value
    ws.end()