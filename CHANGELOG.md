# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).



## [0.2.0] - 2019-09-20
### Added
 - bsconfig.json validation
 - slightly smarter intellisense that knows when you're trying to complete an object property. 
 - diagnostic for depricated brsconfig.json
 - basic transpile support including sourcemaps. Most lines also support transpiling including comments, but there may still be bugs
 - parser now includes all comments as tokens in the AST.

### Fixed
 - bugs in the languageserver intellisense
 - parser bug that would fail when a line ended with a period
 - prevent intellisense when typing inside a comment
 - Bug during file creation that wouldn't recognize the file


## 0.1.0 - 2019-08-10
### Changed
 - Cloned from [brightscript-language](https://github.com/twitchbronbron/brightscript-language)



[0.2.0]:  https://github.com/rokucommunity/brighterscript/compare/v0.1.0...v0.2.0
[0.1.0]:  https://github.com/rokucommunity/brighterscript/compare/v0.1.0...v0.1.0