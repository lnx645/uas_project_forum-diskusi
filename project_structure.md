# 📁 mardira_forums - Project Structure

*Generated on: 6/20/2026, 10:52:10 AM*

## 📋 Quick Overview

| Metric | Value |
|--------|-------|
| 📄 Total Files | 107 |
| 📁 Total Folders | 40 |
| 🌳 Max Depth | 7 levels |
| 🛠️ Tech Stack | React, TypeScript, CSS, Node.js |

## ⭐ Important Files

- 🟡 🚫 **.gitignore** - Git ignore rules
- 🟡 🚫 **.gitignore** - Git ignore rules
- 🟡 🚫 **.gitignore** - Git ignore rules
- 🔴 📦 **package.json** - Package configuration
- 🔴 📖 **README.md** - Project documentation
- 🟡 🔷 **tsconfig.json** - TypeScript config
- 🔴 📖 **README.md** - Project documentation

## 📊 File Statistics

### By File Type

- 📄 **.java** (Other files): 47 files (43.9%)
- ⚛️ **.tsx** (React TypeScript files): 26 files (24.3%)
- ⚙️ **.json** (JSON files): 4 files (3.7%)
- 🎨 **.svg** (SVG images): 4 files (3.7%)
- 🔷 **.ts** (TypeScript files): 4 files (3.7%)
- 📄 **.** (Other files): 3 files (2.8%)
- 🚫 **.gitignore** (Git ignore): 3 files (2.8%)
- 📖 **.md** (Markdown files): 3 files (2.8%)
- 📄 **.properties** (Other files): 2 files (1.9%)
- 📄 **.lock** (Other files): 2 files (1.9%)
- 🎨 **.css** (Stylesheets): 2 files (1.9%)
- 📄 **.ps1** (Other files): 1 files (0.9%)
- 📄 **.sh** (Other files): 1 files (0.9%)
- 📜 **.js** (JavaScript files): 1 files (0.9%)
- 🌐 **.html** (HTML files): 1 files (0.9%)
- 🖼️ **.png** (PNG images): 1 files (0.9%)
- 📄 **.cmd** (Other files): 1 files (0.9%)
- ⚙️ **.xml** (XML files): 1 files (0.9%)

### By Category

- **Other**: 57 files (53.3%)
- **React**: 26 files (24.3%)
- **Config**: 5 files (4.7%)
- **Assets**: 5 files (4.7%)
- **TypeScript**: 4 files (3.7%)
- **DevOps**: 3 files (2.8%)
- **Docs**: 3 files (2.8%)
- **Styles**: 2 files (1.9%)
- **JavaScript**: 1 files (0.9%)
- **Web**: 1 files (0.9%)

### 📁 Largest Directories

- **root**: 107 files
- **src**: 49 files
- **src\main**: 48 files
- **src\main\java\com\uas\mardira_forum**: 47 files
- **src\main\java\com\uas**: 47 files

## 🌳 Directory Structure

```
mardira_forums/
├── 📄 .gitattributes
├── 📂 .github/
│   └── 📂 modernize/
│   │   └── 📂 java-upgrade/
│   │   │   ├── 🟡 🚫 **.gitignore**
│   │   │   └── 🎣 hooks/
│   │   │   │   └── 📂 scripts/
│   │   │   │   │   ├── 📄 recordToolUse.ps1
│   │   │   │   │   └── 📄 recordToolUse.sh
├── 🟡 🚫 **.gitignore**
├── 📂 .mvn/
│   └── 📂 wrapper/
│   │   └── 📄 maven-wrapper.properties
├── 🚀 app/
│   ├── 🟡 🚫 **.gitignore**
│   ├── 📄 bun.lock
│   ├── 📜 eslint.config.js
│   ├── 🌐 index.html
│   ├── 🔴 📦 **package.json**
│   ├── 🌐 public/
│   │   ├── 🎨 favicon.svg
│   │   └── 🎨 icons.svg
│   ├── 🔴 📖 **README.md**
│   ├── 📁 src/
│   │   ├── 🎨 App.css
│   │   ├── ⚛️ App.tsx
│   │   ├── 📦 assets/
│   │   │   ├── 🖼️ hero.png
│   │   │   ├── 🎨 react.svg
│   │   │   └── 🎨 vite.svg
│   │   ├── 🧩 components/
│   │   │   ├── ⚛️ AnswerForm.tsx
│   │   │   ├── ⚛️ AnswerItem.tsx
│   │   │   ├── ⚛️ Button.tsx
│   │   │   ├── ⚛️ DiscussionDetail.tsx
│   │   │   ├── ⚛️ Header.tsx
│   │   │   ├── ⚛️ Input.tsx
│   │   │   ├── ⚛️ LoginActionInfoBanner.tsx
│   │   │   ├── ⚛️ QuestionHeader.tsx
│   │   │   ├── ⚛️ SidebarWidget.tsx
│   │   │   ├── ⚛️ UserCard.tsx
│   │   │   └── ⚛️ VotePanel.tsx
│   │   ├── 📂 contexts/
│   │   │   ├── ⚛️ UserContextProvider.tsx
│   │   │   └── ⚛️ WebsocketContext.tsx
│   │   ├── 📂 core/
│   │   │   ├── 🔷 api.ts
│   │   │   └── 🔷 formatter.ts
│   │   ├── 🎨 index.css
│   │   ├── 📂 layouts/
│   │   │   ├── ⚛️ AppLayout.tsx
│   │   │   └── ⚛️ RootLayout.tsx
│   │   ├── ⚛️ main.tsx
│   │   ├── 📂 page/
│   │   │   ├── 📂 auth/
│   │   │   │   ├── ⚛️ login.tsx
│   │   │   │   └── ⚛️ register.tsx
│   │   │   ├── ⚛️ create-question.tsx
│   │   │   ├── ⚛️ detail-question.tsx
│   │   │   ├── ⚛️ edit-answer.tsx
│   │   │   ├── ⚛️ home.tsx
│   │   │   ├── ⚛️ questions.tsx
│   │   │   ├── ⚛️ tags.tsx
│   │   │   └── ⚛️ TextPage.tsx
│   │   └── 📂 store/
│   │   │   └── 🔷 useTagStore.ts
│   ├── ⚙️ tsconfig.app.json
│   ├── 🟡 🔷 **tsconfig.json**
│   ├── ⚙️ tsconfig.node.json
│   └── 🔷 vite.config.ts
├── 📄 bun.lock
├── 📖 HELP.md
├── 📄 mvnw
├── 📄 mvnw.cmd
├── ⚙️ pom.xml
├── 🔴 📖 **README.md**
└── 📁 src/
│   ├── 📂 main/
│   │   ├── 📂 java/
│   │   │   └── 📂 com/
│   │   │   │   └── 📂 uas/
│   │   │   │   │   └── 📂 mardira_forum/
│   │   │   │   │   │   ├── 📂 configuration/
│   │   │   │   │   │   │   ├── 📄 AuthChannelInterceptor.java
│   │   │   │   │   │   │   ├── 📄 CorsConfig.java
│   │   │   │   │   │   │   ├── 📄 SecurityConfig.java
│   │   │   │   │   │   │   └── 📄 WebsocketConfig.java
│   │   │   │   │   │   ├── 📂 controllers/
│   │   │   │   │   │   │   ├── 📄 AnswerContorller.java
│   │   │   │   │   │   │   ├── 📄 AuthController.java
│   │   │   │   │   │   │   ├── 📄 QuestionRestController.java
│   │   │   │   │   │   │   ├── 📄 TagMessageController.java
│   │   │   │   │   │   │   ├── 📄 TagRestController.java
│   │   │   │   │   │   │   ├── 📄 TestSocket.java
│   │   │   │   │   │   │   └── 📄 VoteController.java
│   │   │   │   │   │   ├── 📂 dto/
│   │   │   │   │   │   │   ├── 📄 AnswerResponseDto.java
│   │   │   │   │   │   │   ├── 📄 AuthResponseDto.java
│   │   │   │   │   │   │   ├── 📄 LoginRequestDto.java
│   │   │   │   │   │   │   ├── 📄 PostMessageDto.java
│   │   │   │   │   │   │   ├── 📄 QuestionAnswerRequestDto.java
│   │   │   │   │   │   │   ├── 📄 QuestionPageResponseDto.java
│   │   │   │   │   │   │   ├── 📄 QuestionRequestDto.java
│   │   │   │   │   │   │   ├── 📄 QuestionResponseDto.java
│   │   │   │   │   │   │   ├── 📄 RegisterRequestDto.java
│   │   │   │   │   │   │   ├── 📄 TagRequestDto.java
│   │   │   │   │   │   │   ├── 📄 TagResponseDto.java
│   │   │   │   │   │   │   ├── 📄 UserResponseDTO.java
│   │   │   │   │   │   │   └── 📄 VoteRequestDto.java
│   │   │   │   │   │   ├── 📂 exception/
│   │   │   │   │   │   │   ├── 📄 NoResource
│   │   │   │   │   │   │   ├── 📄 ResourceNotFoundException.java
│   │   │   │   │   │   │   └── 📄 UnauthorizedAccessException.java
│   │   │   │   │   │   ├── 📂 filter/
│   │   │   │   │   │   │   └── 📄 JwtAuthFilter.java
│   │   │   │   │   │   ├── 📄 MardiraForumApplication.java
│   │   │   │   │   │   ├── 📂 model/
│   │   │   │   │   │   │   ├── 📄 Answer.java
│   │   │   │   │   │   │   ├── 📄 CustomUserDetails.java
│   │   │   │   │   │   │   ├── 📄 Question.java
│   │   │   │   │   │   │   ├── 📄 Tags.java
│   │   │   │   │   │   │   ├── 📄 User.java
│   │   │   │   │   │   │   ├── 📄 VoteAnswer.java
│   │   │   │   │   │   │   └── 📄 VoteQuestion.java
│   │   │   │   │   │   ├── 📂 repository/
│   │   │   │   │   │   │   ├── 📄 AnswerRepository.java
│   │   │   │   │   │   │   ├── 📄 AnswerVoteRepository.java
│   │   │   │   │   │   │   ├── 📄 QuestionRepository.java
│   │   │   │   │   │   │   ├── 📄 QuestionVoteRepository.java
│   │   │   │   │   │   │   ├── 📄 TagRepository.java
│   │   │   │   │   │   │   └── 📄 UserRepository.java
│   │   │   │   │   │   └── 📂 services/
│   │   │   │   │   │   │   ├── 📄 AnswerService.java
│   │   │   │   │   │   │   ├── 📄 CustomUserDetailsService.java
│   │   │   │   │   │   │   ├── 📄 JwtUtil.java
│   │   │   │   │   │   │   ├── 📄 QuestionService.java
│   │   │   │   │   │   │   └── 📄 VoteService.java
│   │   └── 📂 resources/
│   │   │   ├── 📄 application.properties
│   │   │   ├── 📂 static/
│   │   │   └── 📂 templates/
│   └── 📂 test/
│   │   └── 📂 java/
│   │   │   └── 📂 com/
│   │   │   │   └── 📂 uas/
│   │   │   │   │   └── 📂 mardira_forum/
│   │   │   │   │   │   └── 📄 DemoApplicationTests.java
```

## 📖 Legend

### File Types
- 📄 Other: Other files
- 🚫 DevOps: Git ignore
- 📜 JavaScript: JavaScript files
- 🌐 Web: HTML files
- ⚙️ Config: JSON files
- 🎨 Assets: SVG images
- 📖 Docs: Markdown files
- 🎨 Styles: Stylesheets
- ⚛️ React: React TypeScript files
- 🖼️ Assets: PNG images
- 🔷 TypeScript: TypeScript files
- ⚙️ Config: XML files

### Importance Levels
- 🔴 Critical: Essential project files
- 🟡 High: Important configuration files
- 🔵 Medium: Helpful but not essential files
