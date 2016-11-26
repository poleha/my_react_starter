export default {
    api: {
      host: __DEVELOPMENT__? 'localhost' : 'ec2-54-197-19-181.compute-1.amazonaws.com',
      port: 8000,
      version: 1  
    },
    cookie : {
        expireDays: 7
    }
}