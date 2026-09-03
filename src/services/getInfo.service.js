const UAParser = require('ua-parser-js');

/**
 * getLoginInfo is a function it will return
 * - ip of the device
 * - device name
 * - browser name
 * - os name 
 */

const getLoginInfo = (req) => {
    const ip = req.ip;

    const parser = new UAParser(req.headers['user-agent']);

    const browser = parser.getBrowser().name || 'Unknown Browser';
    const os = parser.getOS().name || 'Unknown OS';

    const deviceType = parser.getDevice().type;

    let device = `${browser} on ${os}`;

    if (deviceType) device = `${deviceType} - ${device}`;

    return {
        ip,
        device,
        browser,
        os
    };
};

module.exports = getLoginInfo;