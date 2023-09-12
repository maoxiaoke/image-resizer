<image src="./example.gif" />

## Overview

This plugin allow you resize your notes of Obsidian.

Support the development of my plugins and themes **@xiaokedada** on [Twitter](https://twitter.com/xiaokedada) or [Buy me a coffee](https://www.buymeacoffee.com/nazha).

<a href="https://www.buymeacoffee.com/nazha"><img src="https://img.buymeacoffee.com/button-api/?text=Buy me a coffee&emoji=&slug=nazha&button_colour=6a8695&font_colour=ffffff&font_family=Poppins&outline_colour=000000&coffee_colour=FFDD00"></a>


## Install

Because this plugin has not yet been released to the community, you can clone this repo to the `plugins` directory in your vault's [`.obsidian` directory](https://help.obsidian.md/Files+and+folders/How+Obsidian+stores+data) so that Obsidian can find it.

1. Open a terminal window and change this project directory to the `plugins` directory.

```shell
cd path/to/valut
cd .obsidian/plugins
```

2. Clone this repo using Git.

```shell
git clone git@github.com:maoxiaoke/image-resizer.git
```

3. Restart the Obsidian.

## Usage

In simple terms, this plugin search the keyword of `alt` in Obsidian [Wikilinks](https://help.obsidian.md/Linking+notes+and+files/Internal+links) and MarkDown Links.

```text
![[wallhaven-p9o51m.png | fit rounded]]

![fit rounded](wallhaven-p9o51m.png)
```

Those keywords are:

### width

- `full`, 100% width of the page width
- `wide`, 88% width of the page width
- `fit`, 80% width of the line width
- `half`, 50% width of the line width
- `1/2`, the same as `half`
- `2/3`
- `3/5`
- `4/5`
- `5/6`

This plugin of support arbitrary width values follow by `w-`, such as `w-300`. This feature can be turned on in the plugin's settings.

## Position

- `center`, the default
- `left`
- `right`

## Styles

- `rounded`
- `rounded-full`

