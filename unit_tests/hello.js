const Sync = require("../src/sync");

const hello = async () => {
    response = await Sync.run(
        {},
        '/hello_world',
        {},
        'GET'
    );
    
    console.log(response);
}

hello();