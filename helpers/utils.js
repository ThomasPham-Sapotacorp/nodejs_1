const ItemModel = require(__path_schemas + 'items');

let createFilterStatus = async (currentStatus) => {
    let statusFilter = [
		{name: 'all', count: 1, link: '#', class: 'default'},
		{name: 'active', count: 1, link: '#', class: 'default'},
		{name: 'inactive', count: 1, link: '#', class: 'default'},
	]
	for(let i = 0; i< statusFilter.length; i++){
		let checkStatus = {};
		let item = statusFilter[i];
		if(item.name == currentStatus)  statusFilter[i].class = 'success';
        if(item.name != 'all')  checkStatus = {status: item.name};
		console.log(item.name);
		await ItemModel.count(checkStatus).then((data) => {
			statusFilter[i].count = data;
			console.log('data ' + data);
		})
	}
    return statusFilter;
}

module.exports = {
    createFilterStatus: createFilterStatus
}