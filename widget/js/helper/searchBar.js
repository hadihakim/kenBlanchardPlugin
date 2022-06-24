'use strict';


const scrollTop = () => {
	mainContainer.scrollTo({ top: 0, behavior: 'smooth' });
}

function filterDrawer() {
	buildfire.components.drawer.open(
		{
			content: 'Topics',
			multiSelection: true,
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

function sortDrawer() {
	buildfire.components.drawer.open(
		{
			content: 'Sort',
			enableFilter: true,
			multiSelectionActionButton: { text: 'Apply' },
			isHTML: true,
			triggerCallbackOnUIDismiss: false,
			autoUseImageCdn: true,
			listItems: [
				{ text: 'Default', selected: false },
				{ text: 'Most Popular', selected: false },
				{ text: 'Most Recent', selected: false }
			]
		},
		(err, result) => {
			if (err) return console.error(err);
			console.log("Selected Contacts", result);
		}

	);
}

let filterIcon = document.getElementById("filterIcon");
filterIcon.addEventListener("click", filterDrawer);

let sortIcon = document.getElementById("sortIcon");
sortIcon.addEventListener("click", sortDrawer);


