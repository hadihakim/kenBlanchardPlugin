'use strict';


const scrollTop = () => {
	window.scrollTo({ top: 0, behavior: 'smooth' });
}

function testDrawer() {
	buildfire.components.drawer.open(
		{
			content: 'Topics',
			multiSelection: true,
			height: '100%',
			allowSelectAll: true,
			multiSelectionActionButton: { text: 'Apply' },
			enableFilter: true,
			isHTML: true,
			triggerCallbackOnUIDismiss: false,
			autoUseImageCdn: true,
			listItems: [
				{ text: 'Coaching', selected: false },
				{ text: 'Conflict', selected: false },
				{ text: 'Customer Service', selected: false },
				{ text: 'Change & Innovation', selected: false },
				{ text: 'Diversity, Equity & Inclusion ', selected: false },
				{ text: 'Change & Innovation', selected: false },
				{ text: 'Leading People', selected: false },
				{ text: 'Performance Management', selected: false },
				{ text: 'Personal Effectiveness', selected: false },
				{ text: 'Team Effectiveness', selected: false },
				{ text: 'Trust', selected: false },
				{ text: 'Working with Others', selected: false }
			]
		},
		(err, result) => {
			if (err) return console.error(err);
			console.log("Selected Contacts", result);
		}

	);
}

let filterIcon = document.getElementById("filterIcon");
filterIcon.addEventListener("click", testDrawer);


