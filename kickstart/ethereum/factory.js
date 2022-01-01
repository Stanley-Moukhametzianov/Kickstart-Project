import web3 from './web3';
import CampaignFactory from './build/CampaignFactory.json';

const instance = new web3.eth.Contract(
  JSON.parse(CampaignFactory.interface),
  '0x8890AE7E649288deD61dc01266E0AB1cD9A3131a'
);

export default instance;
