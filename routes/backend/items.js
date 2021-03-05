var express 	= require('express');
var router 		= express.Router();
const flash 	= require('express-flash');
const sessions 	= require('express-session');
const { check, validationResult } = require('express-validator');

const ItemModel 	= require(__path_schemas + 'items');
const UtilsHelpers 	= require(__path_helpers + 'utils');
const ParamsHelpers = require(__path_helpers + 'params');
const systemConfig 	= require(__path_configs + 'system');

const linkIndex 	= '/' + systemConfig.prefixAdmin + '/items/';
const folderView 	= 'pages/items'


router.get('(/status/:status)?', async(req, res, next) => {
	let check = {};	
				// lay currentStatus
	let currentStatus = ParamsHelpers.getParam(req.params, 'status', 'all');
				// lay search
	let search = ParamsHelpers.getParam(req.query, 'search', '');	
				// lay statusFilter
	let statusFilter = await UtilsHelpers.createFilterStatus(currentStatus);
				// lay pagination
	let pagination = {
		totalItems			: 0,
		totalItemsPerPage	: 3,
		currentPage			: 1,
		pageRanges			: 4
	}
	pagination.currentPage = parseInt(ParamsHelpers.getParam(req.query, 'page', '1')); //chuyen currentPage ve int
	// console.log('pagination',pagination);

	if(currentStatus != 'all') check.status = currentStatus;
	if(search != '') check.name = new RegExp(search, 'i');
	//console.log('check',check);

	await ItemModel.count(check).then((data) => {
		pagination.totalItems = data;
	});

	ItemModel
		.find(check)
		.limit(pagination.totalItemsPerPage)
		.skip( (pagination.currentPage - 1) * pagination.totalItemsPerPage)
		.sort({ordering: 'asc'})
		.collation({locale: "en_US", numericOrdering: true})
		.then( (items) => {
			res.render(`${folderView}/list`, { 
				title: 'Item List Page' ,
				items,
				statusFilter,
				currentStatus,
				search,
				pagination,
			});
			// console.log(items);
		});	 
});

router.get('/change-status/:id/:status', (req, res, next) => {
	let currentStatus 	= ParamsHelpers.getParam(req.params, 'status', 'active');
	let id 				= ParamsHelpers.getParam(req.params, 'id', '');
	let status			= (currentStatus === "active") ? "inactive" : "active";
	console.log('id',id);
	ItemModel.updateOne({_id: id}, {status: status}, (err, result) => {
		req.flash('success','Cập nhật status thành công', false);
		res.redirect(linkIndex);
	});
});

router.get('/delete/:id/', (req, res, next) => {
	let id 				= ParamsHelpers.getParam(req.params, 'id', '');
	ItemModel.deleteOne({_id: id}, (err, result) => {
		req.flash('success','Xóa item thành công', false);
		res.redirect(linkIndex);
	});
});

router.post('/change-status/:status', (req, res, next) => {
	let currentStatus 	= ParamsHelpers.getParam(req.params, 'status', 'active');
	ItemModel.updateMany({_id: { $in: req.body.cid }}, {status: currentStatus}, (err, result) => {
		req.flash('success','Cập nhật ' + result.n + ' status thành công', false);
		res.redirect(linkIndex);
	});
	console.log(req.body);
});

router.post('/delete/', (req, res, next) => {
	ItemModel.remove({_id: { $in: req.body.cid }}, (err, result) => {
		req.flash('success','Xóa ' + result.n + ' item thành công', false);
		res.redirect(linkIndex);
	});
});

router.post('/change-ordering/', (req, res, next) => {
	let cids		= req.body.cid;
	let orderings 	= req.body.ordering;
	
	if( Array.isArray(cids )) {		
		cids.forEach((item, index) => {
			ItemModel.updateOne({_id: cids[index]}, {ordering: parseInt(orderings[index])}, (err, result) => {});
		})
	} else{
		ItemModel.updateOne({_id: cids}, {ordering: parseInt(orderings)}, (err, result) => {});
	}	
	req.flash('success','Cập nhật ordering của ' + cids.length + ' item thành công', false);
	res.redirect(linkIndex);

});

//form
router.get(('/add(/:id)?'), (req, res, next) => {
	let id 		= ParamsHelpers.getParam(req.params, 'id', '');
	let item	= {name : '', ordering: 0, status: 'no value'};
	let errors 	= null;
	if(id === ''){
		res.render(`${folderView}/add`, { title: 'Item Add Page', item, errors });
	}else {
		ItemModel.findById(id, (err, item) => {
			res.render(`${folderView}/add`, { title: 'Item Edit Page', item, errors });
		})
	}
});


//add or edit
router.post('/save',
	[	check('name','Chiều dài lớn hơn 5 ký tự').isLength({ min: 5 }),
		check('ordering','Phải là 1 số').isInt({gt: 0}),
		check('status','Phải có giá trị').not().equals('novalue')
  	], 
 	(req, res, next) => {
	
	let item = Object.assign(req.body);
	const errors = validationResult(req).errors;

	if (item.id) { //edit
		if (errors.length > 0) {
			res.render(`${folderView}/add`, {title: 'Edit Page', item, 	errors})
		}else{
			ItemModel.updateOne({_id: item.id}, {
				name: item.name, 
				status: item.status,
				ordering: item.ordering
			},(err, result) => {
				req.flash('success','Cập nhật thành công', false);
				res.redirect(linkIndex);
			});
		}
	}else{	//add
		if (errors.length > 0) {
			res.render(`${folderView}/add`, {title: 'Add Page', item, 	errors})
		}else{
			new ItemModel(item).save().then(() => {
			req.flash('success','Thêm thành công', false);
			res.redirect(linkIndex);
			})
		}
		
	}



});


module.exports = router;
