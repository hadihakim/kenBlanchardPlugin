const searchTableTopicsConfig = {
    options: {
        showEditButton: true,
        showDeleteButton: true,
        localData: true,
        itemTitleColumn: "title",
        itemName: "Topic",
        pageSize: 15
    },
    columns: [{
            header: "Title",
            data: "${data.title}",
            type: "boldText",
            sortBy: 'title'
        },
        {
            header: "Tag",
            data: "${data.tag.join(', ')}",
            type: "string",
            width: "150px",
        },
        {
            header: "Trending",
            command: "toggleTrending",
            data: "${data.isTrending}",
            type: "toggle",
            toggleOn: true,
            toggleOff: false,
            toggleCol: "isTrending",
            width: "100px"
        }
    ]

};

const searchTableAssetsConfig = {
    options: {
        showEditButton: true,
        showDeleteButton: true,
        localData: false,
        itemTitleColumn: "meta.title",
        itemName: "Asset",
        pageSize: 15
    },
    columns: [{
            header: "",
            data: "${data.meta.image}",
            type: "image",
            width: "76px",
        },
        {
            header: "Title",
            data: "${data.meta.title} <br/> <span class='text-info'>${data.meta.actionType || data.type}</span>",
            type: "boldText",
            sortBy: '_buildfire.index.text'
        },
        {
            header: "Topics",
            data: "${SectionsDetails.getAssetTopicsTitles(data.meta.topics).join(', ')}",
            type: "string",
            width: "150px",
        },
        {
            header: "Created On",
            data: "${data.createdOn}",
            type: "date",
            width: "120px",
        }
    ]

};

const searchTableSectionAssetsConfig = {
    options: {
        showEditButton: true,
        showDeleteButton: true,
        localData: true,
        itemTitleColumn: "meta.title",
        itemName: "Asset",
        pageSize: 15
    },
    columns: [{
            header: "",
            data: "${data.meta.image}",
            type: "image",
            width: "76px",
        },
        {
            header: "Title",
            data: "${data.meta.title} <br/> <span class='text-info'>${data.meta.actionType || data.type}</span>",
            type: "boldText",
            sortBy: 'meta.title'
        },
        {
            header: "Topics",
            data: "${SectionsDetails.getAssetTopicsTitles(data.meta.topics).join(', ')}",
            type: "string",
            width: "150px",
        },
        {
            header: "Created On",
            data: "${data.meta.createdOn}",
            type: "date",
            width: "120px",
        }
    ]

};

const searchTableExistingAssetsConfig = {
    options: {
        showEditButton: false,
        showDeleteButton: false,
        localData: false,
        itemTitleColumn: "meta.title",
        itemName: "Asset",
        pageSize: 15,
        checkedItems: []
    },
    columns: [{
            header: "",
            command: "toggleCheckBox",
            data: "",
            type: "checkBox",
            checkCol: "data.id",
            width: "30px"
        }, {
            header: "Asset Name",
            data: "${data.meta.title}",
            type: "forCheckBox",
            command: "toggleCheckBox",
        },
        {
            header: "Type",
            data: "${data.type}",
            type: "string",
            width: "150px",
            sortBy: '_buildfire.index.string1'
        }
    ]

};