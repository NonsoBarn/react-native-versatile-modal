# Contributing to React Native Versatile Modal

Thank you for your interest in contributing! 🎉

## 🤝 How to Contribute

### Reporting Bugs

If you find a bug, please open an issue with:

- Clear description of the problem
- Steps to reproduce
- Expected vs actual behavior
- React Native version
- Device/platform (iOS/Android)
- Code example if possible

### Suggesting Features

We love new ideas! Open an issue with:

- Clear description of the feature
- Use case and benefits
- Example API (if applicable)
- Mockups or examples (if relevant)

### Pull Requests

1. **Fork the repository**
2. **Create a branch** from `main`:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Make your changes**
4. **Write/update tests** for your changes
5. **Run tests**:
   ```bash
   npm test
   ```
6. **Run linting**:
   ```bash
   npm run lint:fix
   ```
7. **Commit with clear messages**:
   ```bash
   git commit -m "feat: add custom backdrop color support"
   ```
8. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```
9. **Open a Pull Request** with:
   - Clear title and description
   - Link to related issue (if any)
   - Screenshots/GIFs for UI changes

## 📝 Code Style

- Use TypeScript
- Follow ESLint rules (will auto-check on commit)
- Use Prettier for formatting
- Write meaningful variable/function names
- Add JSDoc comments for public APIs

## 🧪 Testing

- Write unit tests for new features
- Ensure all tests pass before submitting PR
- Aim for >80% code coverage

## 🔄 Development Workflow

```bash
# Install dependencies
npm install

# Run tests in watch mode
npm run test:watch

# Run linting
npm run lint

# Build the package
npm run build

# Type check
npm run typecheck
```

## 📚 Commit Message Format

We follow conventional commits:

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting)
- `refactor:` Code refactoring
- `test:` Test changes
- `chore:` Build/tooling changes

Examples:

```
feat: add support for custom animation curves
fix: resolve drawer position calculation bug
docs: update installation instructions
```

## 🎯 Priority Areas

We're especially interested in:

- Performance improvements
- Accessibility enhancements
- Better TypeScript types
- More comprehensive tests
- Documentation improvements

## ❓ Questions?

Feel free to open a discussion or issue if you have questions!

## 🙏 Thank You!

Every contribution, no matter how small, is valued and appreciated!
