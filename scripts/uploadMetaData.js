const { create } = require('ipfs-http-client');
const client = create('https://ipfs.infura.io:5001/api/v0');

async function uploadToIPFS(room) {
    if (!room.name || !room.type || !room.address || !room.image) return
    /* upload metadata to IPFS */
    const data = JSON.stringify({
      name: room.name, type: room.type, address: room.address, image: room.image
    })
    try {
      const added = await client.add(data);
      const url = `https://ipfs.infura.io/ipfs/${added.path}`;
      /* returning url to be used in mint transaction */
      return url;
    } catch (error) {
      console.log('Error uploading file: ', error);
    }  
  }
  
  module.exports = {
    uploadToIPFS
  }