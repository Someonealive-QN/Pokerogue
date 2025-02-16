import BattleScene, { Button } from "../battle-scene";
import { Biome, biomeLinks, getBiomeName } from "../data/biome";
import { addTextObject, TextStyle } from "./text";
import { Mode } from "./ui";
import UiHandler from "./uiHandler";

export default class BiomeSelectUiHandler extends UiHandler {
  private biomeSelectContainer: Phaser.GameObjects.Container;
  private biomeSelectBg: Phaser.GameObjects.Image;
  private biomesText: Phaser.GameObjects.Text;
  private biomeChoices: Biome[];

  private cursorObj: Phaser.GameObjects.Image;

  private biomeSelectHandler: Function;

  constructor(scene: BattleScene) {
    super(scene, Mode.BIOME_SELECT);
  }

  setup() {
    const ui = this.getUi();
    
    this.biomeSelectContainer = this.scene.add.container((this.scene.game.canvas.width / 6) - 97, -49);
    this.biomeSelectContainer.setVisible(false);
    ui.add(this.biomeSelectContainer);

    this.biomeSelectBg = this.scene.add.image(0, 0, 'option_select_window_2');
    this.biomeSelectBg.setOrigin(0, 1);
    this.biomeSelectContainer.add(this.biomeSelectBg);

    this.biomesText = addTextObject(this.scene, 0, 0, '', TextStyle.WINDOW, { maxLines: 3 });
    this.biomesText.setLineSpacing(12);
    this.biomeSelectContainer.add(this.biomesText);
  }

  show(args: any[]) {
    if (args.length >= 2 && typeof(args[0]) === 'number' && args[1] instanceof Function) {
      super.show(args);

      if (!Array.isArray(biomeLinks[args[0]]))
        return;

      this.biomeChoices = biomeLinks[args[0]] as Biome[];
      this.biomeSelectBg.setTexture(`option_select_window_${this.biomeChoices.length}`)
      this.biomesText.setText(this.biomeChoices.map(b => getBiomeName(b)).join('\n'));
      this.biomesText.setPositionRelative(this.biomeSelectBg, 16, 9);
      this.biomeSelectHandler = args[1] as Function;
      
      this.biomeSelectContainer.setVisible(true);
      this.setCursor(0);
    }
  }

  processInput(button: Button): boolean {
    const ui = this.getUi();

    let success = false;

    if (button === Button.ACTION || button === Button.CANCEL) {
      success = true;
      const originalBiomeSelectHandler = this.biomeSelectHandler;
      this.biomeSelectHandler = null;
      originalBiomeSelectHandler(this.cursor);
      this.clear();
    } else {
      switch (button) {
        case Button.UP:
          if (this.cursor)
            success = this.setCursor(this.cursor - 1);
          break;
        case Button.DOWN:
          if (this.cursor < this.biomeChoices.length - 1)
            success = this.setCursor(this.cursor + 1);
          break;
      }
    }

    if (success)
      ui.playSelect();

    return success;
  }

  setCursor(cursor: integer): boolean {
    const ret = super.setCursor(cursor);

    if (!this.cursorObj) {
      this.cursorObj = this.scene.add.image(0, 0, 'cursor');
      this.biomeSelectContainer.add(this.cursorObj);
    }

    this.cursorObj.setPositionRelative(this.biomeSelectBg, 12, 17 + 16 * this.cursor);

    return ret;
  }

  clear() {
    super.clear();
    this.biomeSelectContainer.setVisible(false);
    this.biomeSelectHandler = null;
    this.eraseCursor();
  }

  eraseCursor() {
    if (this.cursorObj)
      this.cursorObj.destroy();
    this.cursorObj = null;
  }
}