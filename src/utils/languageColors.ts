// Language color mapping based on GitHub's language colors
const languageColors: Record<string, string> = {
  'JavaScript': '#f1e05a',
  'TypeScript': '#3178c6',
  'Python': '#3572A5',
  'Java': '#b07219',
  'C++': '#f34b7d',
  'C#': '#178600',
  'PHP': '#4F5D95',
  'Ruby': '#701516',
  'Go': '#00ADD8',
  'Rust': '#dea584',
  'Swift': '#F05138',
  'Kotlin': '#A97BFF',
  'Dart': '#00B4AB',
  'Scala': '#c22d40',
  'R': '#198CE7',
  'Objective-C': '#438eff',
  'Shell': '#89e051',
  'PowerShell': '#012456',
  'HTML': '#e34c26',
  'CSS': '#563d7c',
  'SCSS': '#c6538c',
  'Less': '#1d365d',
  'Vue': '#41b883',
  'React': '#61dafb',
  'Angular': '#dd0031',
  'Svelte': '#FF3E00',
  'Dockerfile': '#384d54',
  'Markdown': '#083fa1',
  'JSON': '#292929',
  'YAML': '#cb171e',
  'GraphQL': '#e10098',
  'SQL': '#336791',
  'PLSQL': '#336791',
  'TSQL': '#336791',
  'Elixir': '#6e4a7e',
  'Clojure': '#db5855',
  'Haskell': '#5e5086',
  'Lua': '#000080',
  'Perl': '#39457E',
  'Racket': '#3c5caa',
  'Erlang': '#B83998',
  'Elm': '#60B5CC',
  'OCaml': '#3be133',
  'F#': '#b845fc',
  'D': '#ba595e',
  'Assembly': '#6E4C13',
  'Julia': '#a270ba',
  'Nim': '#ffc200',
  'Crystal': '#000100',
  'Zig': '#ec915c',
  'V': '#4f87c4',
  'Nix': '#7e7eff',
  'Gleam': '#ffaff3',
  'Pony': '#f2b705',
  'Vim script': '#199f4b',
  'TeX': '#3D6117',
  'Matlab': '#e16737',
  'Solidity': '#AA6746',
  'WebAssembly': '#04133b',
  'COBOL': '#000000',
  'Fortran': '#4d41b1',
  'Lisp': '#3fb68b',
  'Scheme': '#1e4aec',
  'Pascal': '#E3F171',
  'Ada': '#02f88c',
  'HCL': '#844FBA',
  'Terraform': '#7B42BC',
  'Puppet': '#302B6D',
  'Nimble': '#ffc200'
} as const;

/**
 * Returns the color code for a given programming language
 * @param language The name of the programming language (case-sensitive)
 * @returns Hex color code (e.g., '#f1e05a' for JavaScript) or '#cccccc' if not found
 */
export function getLanguageColor(language: string): string {
  if (!language) return '#cccccc';
  return languageColors[language] || '#cccccc';
}

export default languageColors;
