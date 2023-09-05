import {
	App,
	Editor,
	MarkdownView,
	Modal,
	Notice,
	Plugin,
	PluginSettingTab,
	Setting,
} from "obsidian";

interface MyPluginSettings {
	mySetting: string;
}

const DEFAULT_SETTINGS: MyPluginSettings = {
	mySetting: "default",
};

export default class MyPlugin extends Plugin {
	settings: MyPluginSettings;

	addStyle() {
		const css = document.createElement("style");
		css.id = "image-resizer";
		document.getElementsByTagName("head")[0].appendChild(css);

		// add the main class
		document.body.classList.add("image-resizer");
	}

	updateStyle() {
		const el = document.getElementById("image-resizer");

		if (!el) {
			throw "image resizer element is not found";
		}

		el.innerHTML = `
		body.image-resizer {
			/* variables */
			/* width */
			/* position */
		}
		body.image-resizer div[alt~="half"],
		body.image-resizer span[alt~="half"],
		body.image-resizer div[alt~="1/2"],
		body.image-resizer span[alt~="1/2"],
		body.image-resizer div[alt~="2/3"],
		body.image-resizer span[alt~="2/3"],
		body.image-resizer div[alt~="3/5"],
		body.image-resizer span[alt~="3/5"],
		body.image-resizer div[alt~="4/5"],
		body.image-resizer span[alt~="4/5"],
		body.image-resizer div[alt~="5/6"],
		body.image-resizer span[alt~="5/6"] {
			text-align: center;
		}
		body.image-resizer div[alt~="half"] img,
		body.image-resizer span[alt~="half"] img {
			width: 50% !important;
		}
		body.image-resizer div[alt~="1/2"] img,
		body.image-resizer span[alt~="1/2"] img {
			width: 50% !important;
		}
		body.image-resizer div[alt~="2/3"] img,
		body.image-resizer span[alt~="2/3"] img {
			width: 66.66666667% !important;
		}
		body.image-resizer div[alt~="3/5"] img,
		body.image-resizer span[alt~="3/5"] img {
			width: 60% !important;
		}
		body.image-resizer div[alt~="4/5"] img,
		body.image-resizer span[alt~="4/5"] img {
			width: 80% !important;
		}
		body.image-resizer div[alt~="5/6"] img,
		body.image-resizer span[alt~="5/6"] img {
			width: 83.33333333% !important;
		}
		body.image-resizer div[alt~="center"]:has(> img),
		body.image-resizer span[alt~="center"]:has(> img) {
			text-align: center;
		}
		body.image-resizer div[alt~="left"]:has(> img),
		body.image-resizer span[alt~="left"]:has(> img) {
			text-align: left;
		}
		body.image-resizer div[alt~="right"]:has(> img),
		body.image-resizer span[alt~="right"]:has(> img) {
			text-align: right;
		}
		
		`;
	}

	async onload() {
		// await this.loadSettings();

		this.addStyle();
		this.updateStyle();

		// This creates an icon in the left ribbon.
		// const ribbonIconEl = this.addRibbonIcon(
		// 	"dice",
		// 	"Sample Plugin",
		// 	(evt: MouseEvent) => {
		// 		// Called when the user clicks the icon.
		// 		new Notice("This is a notice!");
		// 	}
		// );
		// Perform additional things with the ribbon
		// ribbonIconEl.addClass("my-plugin-ribbon-class");

		// This adds a status bar item to the bottom of the app. Does not work on mobile apps.
		// const statusBarItemEl = this.addStatusBarItem();
		// statusBarItemEl.setText("Status Bar Text");

		// This adds a simple command that can be triggered anywhere
		// this.addCommand({
		// 	id: "open-sample-modal-simple",
		// 	name: "Open sample modal (simple)",
		// 	callback: () => {
		// 		new SampleModal(this.app).open();
		// 	},
		// });
		// This adds an editor command that can perform some operation on the current editor instance
		// this.addCommand({
		// 	id: "sample-editor-command",
		// 	name: "Sample editor command",
		// 	editorCallback: (editor: Editor, view: MarkdownView) => {
		// 		console.log(editor.getSelection());
		// 		editor.replaceSelection("Sample Editor Command");
		// 	},
		// });
		// This adds a complex command that can check whether the current state of the app allows execution of the command
		// this.addCommand({
		// 	id: "open-sample-modal-complex",
		// 	name: "Open sample modal (complex)",
		// 	checkCallback: (checking: boolean) => {
		// 		// Conditions to check
		// 		const markdownView =
		// 			this.app.workspace.getActiveViewOfType(MarkdownView);
		// 		if (markdownView) {
		// 			// If checking is true, we're simply "checking" if the command can be run.
		// 			// If checking is false, then we want to actually perform the operation.
		// 			if (!checking) {
		// 				new SampleModal(this.app).open();
		// 			}

		// 			// This command will only show up in Command Palette when the check function returns true
		// 			return true;
		// 		}
		// 	},
		// });

		// This adds a settings tab so the user can configure various aspects of the plugin
		// this.addSettingTab(new SampleSettingTab(this.app, this));

		// If the plugin hooks up any global DOM events (on parts of the app that doesn't belong to this plugin)
		// Using this function will automatically remove the event listener when this plugin is disabled.
		// this.registerDomEvent(document, "click", (evt: MouseEvent) => {
		// 	console.log("click", evt);
		// });

		// When registering intervals, this function will automatically clear the interval when the plugin is disabled.
		// this.registerInterval(
		// 	window.setInterval(() => console.log("setInterval"), 5 * 60 * 1000)
		// );
	}

	async loadSettings() {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			await this.loadData()
		);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

class SampleModal extends Modal {
	constructor(app: App) {
		super(app);
	}

	onOpen() {
		const { contentEl } = this;
		contentEl.setText("Woah!");
	}

	onClose() {
		const { contentEl } = this;
		contentEl.empty();
	}
}

class SampleSettingTab extends PluginSettingTab {
	plugin: MyPlugin;

	constructor(app: App, plugin: MyPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		// const { containerEl } = this;
		// containerEl.empty();
		// new Setting(containerEl)
		// 	.setName("Setting #1")
		// 	.setDesc("It's a secret")
		// 	.addText((text) =>
		// 		text
		// 			.setPlaceholder("Enter your secret")
		// 			.setValue(this.plugin.settings.mySetting)
		// 			.onChange(async (value) => {
		// 				this.plugin.settings.mySetting = value;
		// 				await this.plugin.saveSettings();
		// 			})
		// 	);
	}
}
