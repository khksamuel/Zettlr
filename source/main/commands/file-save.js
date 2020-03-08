/**
 * @ignore
 * BEGIN HEADER
 *
 * Contains:        SaveFile command
 * CVM-Role:        <none>
 * Maintainer:      Hendrik Erz
 * License:         GNU GPL v3
 *
 * Description:     This command saves the current file.
 *
 * END HEADER
 */

const ZettlrCommand = require('./zettlr-command')
const { trans } = require('../../common/lang/i18n')
const generateFilename = require('../../common/util/generate-filename')

class SaveFile extends ZettlrCommand {
  constructor (app) {
    super(app, 'file-save')
  }

  /**
    * Saves a file. A file MUST be given, for the content is needed to write to
    * a file. Content is always freshly grabbed from the CodeMirror content.
    * @param {String} evt The event name
    * @param  {Object} file An object containing some properties of the file.
    * @return {void}      This function does not return.
    */
  async run (evt, file) {
    if ((file == null) || !file.hasOwnProperty('content')) {
      global.log.error('Could not save file, it\'s either null or has no content', file)
      // No file given -> abort saving process
      return false
    }

    console.log('Saving file')

    // Update word count
    this._app.stats.updateWordCount(file.wordcount || 0)

    let realFile = this._app._fsal.findFile(file.hash || null)
    if (!realFile) {
      console.log('No file found - creating')
      realFile = this._app._fsal.createFile(this._app.getCurrentDir(), generateFilename())
    }

    console.log('saving as ' + realFile.name)
    try {
      this._app._fsal.saveFile(realFile, file.content)
      this._app.clearModified()
    } catch (e) {
      global.log.error(`Error writing file ${realFile.name}!`, e)
    }

    return true
  }
}

module.exports = SaveFile
