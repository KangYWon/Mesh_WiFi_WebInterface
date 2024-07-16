// testData.js
const testData = [
    {
        seq: 1,
        layer: 'Layer 1',
        parent_mac: null,
        my_mac: '00:11:22:33:44:55'
    },
    {
        seq: 2,
        layer: 'Layer 2',
        parent_mac: '00:11:22:33:44:55',
        my_mac: 'aa:bb:cc:dd:ee:ff'
    },
    {
        seq: 3,
        layer: 'Layer 2',
        parent_mac: '00:11:22:33:44:55',
        my_mac: 'aa:bb:cc:dd:ee:AA'
    },
    {
        seq: 4,
        layer: 'Layer 3',
        parent_mac: 'aa:bb:cc:dd:ee:AA',
        my_mac: 'aa:bb:cc:dd:AA:AA'
    },
];

export default testData;