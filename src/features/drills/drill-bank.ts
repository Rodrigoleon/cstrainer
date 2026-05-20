import type { Drill, DrillTopic, DrillType } from "./types";

export const DRILL_TOPICS: DrillTopic[] = [
	"Arrays",
	"Objects",
	"Strings",
	"Sets & Maps",
	"Recursion Basics",
	"Big-O",
	"Async JS",
	"Mixed Interview",
];

export const DRILL_TYPES: Array<{ value: DrillType | "All"; label: string }> = [
	{ value: "All", label: "All" },
	{ value: "code", label: "Code" },
	{ value: "mcq", label: "Multiple choice" },
	{ value: "english", label: "Explain" },
	{ value: "trace", label: "Trace" },
	{ value: "blank-file", label: "Blank file" },
];

export const drillBank: Drill[] = [
	{
		id: "even-numbers",
		level: "Level 1",
		type: "code",
		topic: "Arrays",
		title: "Return only even numbers",
		concept: "filter / modulo / arrays",
		prompt:
			"Write a function named solution that receives an array of numbers and returns a new array containing only the even numbers.",
		signature: "function solution(nums) { ... }",
		starter: `function solution(nums) {
  // return only even numbers
}
`,
		tests: [
			{ input: [[1, 2, 3, 4, 5, 6]], expected: [2, 4, 6] },
			{ input: [[10, 11, 12, 13]], expected: [10, 12] },
			{ input: [[1, 3, 5]], expected: [] },
			{ input: [[]], expected: [] },
		],
		hints: [
			"A number is even when number % 2 === 0.",
			"Use .filter() when you want a new array with only matching values.",
		],
		explanation:
			"This is a classic filtering problem: test each number and keep the ones whose remainder after division by 2 is zero.",
		referenceSolution: `function solution(nums) {
  return nums.filter((num) => num % 2 === 0);
}`,
	},
	{
		id: "greater-than-ten",
		level: "Level 1",
		type: "code",
		topic: "Arrays",
		title: "Return numbers greater than 10",
		concept: "filter / comparison",
		prompt:
			"Write solution(nums) to return a new array with only numbers greater than 10.",
		signature: "function solution(nums) { ... }",
		starter: `function solution(nums) {
  // return numbers greater than 10
}
`,
		tests: [
			{ input: [[5, 10, 11, 12]], expected: [11, 12] },
			{ input: [[20, 1, 30]], expected: [20, 30] },
			{ input: [[1, 2, 3]], expected: [] },
		],
		hints: ["Compare each item with > 10.", "A one-line .filter() works well."],
		explanation:
			"The important move is returning a new array and leaving out values that do not satisfy the comparison.",
		referenceSolution: `function solution(nums) {
  return nums.filter((num) => num > 10);
}`,
	},
	{
		id: "has-admin",
		level: "Level 1",
		type: "code",
		topic: "Arrays",
		title: "Check whether roles contains admin",
		concept: "includes / booleans",
		prompt:
			"Write solution(roles) to return true if the array contains the string 'admin'. Otherwise return false.",
		signature: "function solution(roles) { ... }",
		starter: `function solution(roles) {
  // return true if roles contains "admin"
}
`,
		tests: [
			{ input: [["user", "admin"]], expected: true },
			{ input: [["editor", "viewer"]], expected: false },
			{ input: [[]], expected: false },
		],
		hints: [
			"Arrays have an .includes() method.",
			"Return the boolean directly.",
		],
		explanation:
			"Membership checks are common in interview warmups and production authorization code.",
		referenceSolution: `function solution(roles) {
  return roles.includes("admin");
}`,
	},
	{
		id: "largest-number",
		level: "Level 2",
		type: "code",
		topic: "Arrays",
		title: "Return the largest number",
		concept: "max / loop / comparison",
		prompt:
			"Write solution(nums) to return the largest number in a non-empty array.",
		signature: "function solution(nums) { ... }",
		starter: `function solution(nums) {
  // return the largest number
}
`,
		tests: [
			{ input: [[1, 5, 2]], expected: 5 },
			{ input: [[-10, -3, -50]], expected: -3 },
			{ input: [[42]], expected: 42 },
		],
		hints: [
			"Initialize max to nums[0].",
			"Compare every value to the current max.",
		],
		explanation:
			"Starting with the first value avoids bad defaults when every number is negative.",
		referenceSolution: `function solution(nums) {
  let max = nums[0];
  for (const num of nums) {
    if (num > max) max = num;
  }
  return max;
}`,
	},
	{
		id: "word-counts",
		level: "Level 2",
		type: "code",
		topic: "Objects",
		title: "Count how many times each word appears",
		concept: "object frequency map",
		prompt:
			"Write solution(words) to return an object where each key is a word and each value is how many times it appears.",
		signature: "function solution(words) { ... }",
		starter: `function solution(words) {
  // return an object like { apple: 2, pear: 1 }
}
`,
		tests: [
			{ input: [["apple", "pear", "apple"]], expected: { apple: 2, pear: 1 } },
			{
				input: [["a", "b", "a", "c", "b", "a"]],
				expected: { a: 3, b: 2, c: 1 },
			},
			{ input: [[]], expected: {} },
		],
		hints: [
			"Use an object as a map.",
			"Initialize missing words to zero before incrementing.",
		],
		explanation:
			"Frequency maps are a reusable pattern for duplicates, grouping, histograms, and counting problems.",
		referenceSolution: `function solution(words) {
  const counts = {};
  for (const word of words) {
    counts[word] = (counts[word] || 0) + 1;
  }
  return counts;
}`,
	},
	{
		id: "reverse-string",
		level: "Level 2",
		type: "code",
		topic: "Strings",
		title: "Reverse a string",
		concept: "split / reverse / join",
		prompt: "Write solution(str) to return the reversed version of the string.",
		signature: "function solution(str) { ... }",
		starter: `function solution(str) {
  // return the reversed string
}
`,
		tests: [
			{ input: ["hello"], expected: "olleh" },
			{ input: ["abc"], expected: "cba" },
			{ input: [""], expected: "" },
		],
		hints: [
			"Strings can become arrays with split('').",
			"Arrays have reverse() and join().",
		],
		explanation:
			"JavaScript strings are immutable, so reversing usually means converting to an array and joining back.",
		referenceSolution: `function solution(str) {
  return str.split("").reverse().join("");
}`,
	},
	{
		id: "palindrome",
		level: "Level 2",
		type: "code",
		topic: "Strings",
		title: "Check if a string is a palindrome",
		concept: "reverse / comparison",
		prompt:
			"Write solution(str) to return true if the string reads the same forward and backward.",
		signature: "function solution(str) { ... }",
		starter: `function solution(str) {
  // return true if str is a palindrome
}
`,
		tests: [
			{ input: ["racecar"], expected: true },
			{ input: ["hello"], expected: false },
			{ input: ["a"], expected: true },
			{ input: ["abba"], expected: true },
		],
		hints: [
			"Build the reversed string.",
			"Compare the original and reversed values.",
		],
		explanation:
			"This simple version assumes the input is already normalized and only checks mirror equality.",
		referenceSolution: `function solution(str) {
  return str === str.split("").reverse().join("");
}`,
	},
	{
		id: "absolute-differences",
		level: "Level 2",
		type: "code",
		topic: "Arrays",
		title: "Sum absolute differences from x",
		concept: "Math.abs / loops / sum",
		prompt:
			"Write solution(nums, x) to return the sum of the absolute distances between each number and x.",
		signature: "function solution(nums, x) { ... }",
		starter: `function solution(nums, x) {
  // add up Math.abs(num - x) for every num
}
`,
		tests: [
			{ input: [[2, 4, 7], 4], expected: 5 },
			{ input: [[2, 3], 2], expected: 1 },
			{ input: [[-2, 0, 2], 0], expected: 4 },
		],
		hints: [
			"Distance should never be negative.",
			"Add Math.abs(num - x) for each number.",
		],
		explanation:
			"Absolute distance is a building block for median, clustering, and closest-value problems.",
		referenceSolution: `function solution(nums, x) {
  let total = 0;
  for (const num of nums) total += Math.abs(num - x);
  return total;
}`,
	},
	{
		id: "closest-element-bruteforce",
		level: "Level 3",
		type: "code",
		topic: "Arrays",
		title: "Closest element by brute force",
		concept: "nested loops / minimum search / Math.abs",
		prompt:
			"Return the sorted array element that minimizes the sum of absolute differences to all other elements. If tied, return the smallest value.",
		signature: "function solution(a) { ... }",
		starter: `function solution(a) {
  // try each element as the candidate x
}
`,
		tests: [
			{ input: [[2, 4, 7]], expected: 4 },
			{ input: [[2, 3]], expected: 2 },
			{ input: [[1, 1, 3, 4]], expected: 1 },
			{ input: [[-10, -5, 0, 20]], expected: -5 },
			{ input: [[7]], expected: 7 },
		],
		hints: [
			"Use one loop for the candidate.",
			"Use a second loop to sum distance from that candidate.",
		],
		explanation:
			"The brute-force version is O(n^2), but it makes the optimization idea easy to see.",
		referenceSolution: `function solution(a) {
  let best = a[0];
  let bestSum = Infinity;
  for (const candidate of a) {
    let sum = 0;
    for (const value of a) sum += Math.abs(value - candidate);
    if (sum < bestSum) {
      bestSum = sum;
      best = candidate;
    }
  }
  return best;
}`,
	},
	{
		id: "closest-element-median",
		level: "Level 3",
		type: "code",
		topic: "Arrays",
		title: "Closest element using the median shortcut",
		concept: "sorted arrays / median",
		prompt:
			"Write solution(a) for the same closest-element problem, but use the sorted-array median shortcut. Return the left-middle item for even length.",
		signature: "function solution(a) { ... }",
		starter: `function solution(a) {
  // because the array is sorted, the median minimizes total distance
}
`,
		tests: [
			{ input: [[2, 4, 7]], expected: 4 },
			{ input: [[2, 3]], expected: 2 },
			{ input: [[1, 2, 3, 4]], expected: 2 },
			{ input: [[-10, -5, 0, 20]], expected: -5 },
			{ input: [[100]], expected: 100 },
		],
		hints: [
			"The answer is at an index, not from a loop.",
			"Use Math.floor((a.length - 1) / 2).",
		],
		explanation:
			"For sorted values, the median minimizes the sum of absolute distances.",
		referenceSolution: `function solution(a) {
  return a[Math.floor((a.length - 1) / 2)];
}`,
	},
	{
		id: "first-duplicate",
		level: "Level 3",
		type: "code",
		topic: "Sets & Maps",
		title: "Return the first duplicate you encounter",
		concept: "Set / duplicates",
		prompt:
			"Write solution(nums) to return the first number that appears for a second time as you scan from left to right. If none exists, return -1.",
		signature: "function solution(nums) { ... }",
		starter: `function solution(nums) {
  // track numbers you have already seen
}
`,
		tests: [
			{ input: [[2, 1, 3, 5, 3, 2]], expected: 3 },
			{ input: [[1, 2, 3, 4]], expected: -1 },
			{ input: [[9, 9]], expected: 9 },
		],
		hints: [
			"A Set gives fast membership checks.",
			"Check before adding the current number.",
		],
		explanation:
			"Scanning left to right means the first repeated encounter wins, not the value with the lowest index overall.",
		referenceSolution: `function solution(nums) {
  const seen = new Set();
  for (const num of nums) {
    if (seen.has(num)) return num;
    seen.add(num);
  }
  return -1;
}`,
	},
	{
		id: "two-sum-basic",
		level: "Level 3",
		type: "code",
		topic: "Sets & Maps",
		title: "Check whether two numbers add to target",
		concept: "Set / complements",
		prompt:
			"Write solution(nums, target) to return true if any two different numbers in the array add up to target. Otherwise return false.",
		signature: "function solution(nums, target) { ... }",
		starter: `function solution(nums, target) {
  // check if the complement exists
}
`,
		tests: [
			{ input: [[2, 7, 11, 15], 9], expected: true },
			{ input: [[1, 2, 3], 10], expected: false },
			{ input: [[3, 3], 6], expected: true },
			{ input: [[5], 10], expected: false },
		],
		hints: [
			"For each num, needed = target - num.",
			"Only match against numbers already seen.",
		],
		explanation:
			"The set stores previous values, letting each complement lookup be O(1) on average.",
		referenceSolution: `function solution(nums, target) {
  const seen = new Set();
  for (const num of nums) {
    if (seen.has(target - num)) return true;
    seen.add(num);
  }
  return false;
}`,
	},
	{
		id: "timed-mixed-array",
		level: "Level 4",
		type: "code",
		topic: "Mixed Interview",
		title: "Timed mixed array drill",
		concept: "speed / recall / arrays",
		prompt:
			"Write solution(nums) to return an object with evens, odds, and max. nums is non-empty.",
		signature: "function solution(nums) { ... }",
		starter: `function solution(nums) {
  // return { evens: [...], odds: [...], max: number }
}
`,
		tests: [
			{
				input: [[1, 2, 3, 4]],
				expected: { evens: [2, 4], odds: [1, 3], max: 4 },
			},
			{ input: [[10, 5, 8]], expected: { evens: [10, 8], odds: [5], max: 10 } },
			{
				input: [[-3, -2, -1]],
				expected: { evens: [-2], odds: [-3, -1], max: -1 },
			},
		],
		hints: [
			"Use one pass and push into evens or odds.",
			"Update max as you loop.",
		],
		explanation:
			"This combines classification and maximum search, which is common in timed interview screens.",
		referenceSolution: `function solution(nums) {
  const evens = [];
  const odds = [];
  let max = nums[0];
  for (const num of nums) {
    if (num % 2 === 0) evens.push(num);
    else odds.push(num);
    if (num > max) max = num;
  }
  return { evens, odds, max };
}`,
	},
	{
		id: "translate-nested-loop",
		level: "Level 2",
		type: "english",
		topic: "Arrays",
		title: "Translate nested loops into English",
		concept: "reading code",
		prompt:
			"Explain what this code is trying to do. Do not explain syntax only. Explain the intention.",
		code: `let minimalSum = Infinity;
let indexOfMinimum = -1;

for (let i = 0; i < a.length; i++) {
  let sum = 0;
  for (let j = 0; j < a.length; j++) {
    sum += Math.abs(a[j] - a[i]);
  }
  if (sum < minimalSum) {
    minimalSum = sum;
    indexOfMinimum = i;
  }
}
return a[indexOfMinimum];`,
		keywords: ["candidate", "each", "distance", "sum", "minimum", "return"],
		expected:
			"It tries each array element as a candidate, calculates total distance from that candidate to every value, keeps the candidate with the smallest total distance, and returns it.",
		hints: [
			"Focus on the intention of the outer loop.",
			"The inner loop measures total distance for one candidate.",
		],
		explanation:
			"Interviewers often want you to translate loops into purpose before optimizing them.",
	},
	{
		id: "translate-filter",
		level: "Level 1",
		type: "english",
		topic: "Arrays",
		title: "Translate filter into English",
		concept: "array methods",
		prompt: "Explain what this code returns.",
		code: `function solution(nums) {
  return nums.filter((num) => num > 10);
}`,
		keywords: ["return", "numbers", "greater", "10", "new", "array"],
		expected:
			"It returns a new array containing only the numbers from nums that are greater than 10.",
		hints: [
			"Name what filter does.",
			"Mention the condition that keeps a number.",
		],
		explanation:
			"Good explanations connect the method to the data transformation.",
	},
	{
		id: "translate-frequency-map",
		level: "Level 2",
		type: "english",
		topic: "Objects",
		title: "Translate a frequency map",
		concept: "objects / counting",
		prompt: "Explain the purpose of this code.",
		code: `function solution(words) {
  const counts = {};
  for (const word of words) {
    if (!counts[word]) counts[word] = 0;
    counts[word]++;
  }
  return counts;
}`,
		keywords: ["count", "word", "object", "appears", "return"],
		expected:
			"It counts how many times each word appears and returns an object where each word is a key and each value is that word's count.",
		hints: [
			"Look at how counts[word] changes.",
			"The returned object is a frequency map.",
		],
		explanation:
			"Objects can act as dictionaries when you need to count arbitrary labels.",
	},
	{
		id: "translate-set-duplicate",
		level: "Level 3",
		type: "english",
		topic: "Sets & Maps",
		title: "Translate Set duplicate logic",
		concept: "Set / duplicate detection",
		prompt: "Explain what this code detects.",
		code: `function solution(nums) {
  const seen = new Set();
  for (const num of nums) {
    if (seen.has(num)) return true;
    seen.add(num);
  }
  return false;
}`,
		keywords: ["duplicate", "seen", "before", "true", "false"],
		expected:
			"It scans numbers left to right, remembers values already seen, returns true when it finds a duplicate, and returns false if no duplicate exists.",
		hints: ["Explain the role of the Set.", "Mention both return paths."],
		explanation:
			"Sets are useful when the question is whether something has appeared before.",
	},
	{
		id: "trace-closest-247",
		level: "Level 2",
		type: "trace",
		topic: "Arrays",
		title: "Trace closest element: [2, 4, 7]",
		concept: "manual tracing",
		prompt:
			"For each candidate x in [2, 4, 7], calculate the total absolute distance. Enter sums in array order, then enter the final answer.",
		values: [2, 4, 7],
		expectedSums: [7, 5, 8],
		expectedAnswer: 4,
		hints: [
			"For candidate 2, add |2-2| + |4-2| + |7-2|.",
			"Repeat the same total-distance calculation for each value.",
		],
		explanation:
			"Tracing makes the brute-force algorithm concrete before you reach for the median shortcut.",
	},
	{
		id: "trace-closest-23",
		level: "Level 2",
		type: "trace",
		topic: "Arrays",
		title: "Trace closest element: [2, 3]",
		concept: "tie handling",
		prompt:
			"Calculate the total distance for each candidate. If tied, choose the smaller value.",
		values: [2, 3],
		expectedSums: [1, 1],
		expectedAnswer: 2,
		hints: [
			"Both candidates have total distance 1.",
			"The tie rule chooses the smaller value.",
		],
		explanation:
			"Stating tie behavior precisely is part of solving interview problems correctly.",
	},
	{
		id: "trace-closest-negative",
		level: "Level 3",
		type: "trace",
		topic: "Arrays",
		title: "Trace closest element: [-10, -5, 0, 20]",
		concept: "negative numbers / absolute distance",
		prompt: "Trace every candidate and find the winner.",
		values: [-10, -5, 0, 20],
		expectedSums: [45, 35, 35, 85],
		expectedAnswer: -5,
		hints: [
			"Absolute distance stays positive even with negative values.",
			"-5 and 0 tie on total distance.",
		],
		explanation:
			"The tie rule picks -5 because it is the smaller value among the tied candidates.",
	},
	{
		id: "blank-closest-element",
		level: "Level 3",
		type: "blank-file",
		topic: "Arrays",
		title: "Blank file: closest element",
		concept: "comments first / brute force",
		prompt:
			"Start from a blank file. First write comments for the plan. Then write solution(a). Return the array element with the smallest total absolute distance. If tied, return the smaller element.",
		signature: "function solution(a) { ... }",
		starter: `function solution(a) {
  // 1. Try each number as the candidate x
  // 2. For each candidate, calculate total distance to every number
  // 3. Keep the candidate with the smallest sum
  // 4. Return the best candidate

}
`,
		tests: [
			{ input: [[2, 4, 7]], expected: 4 },
			{ input: [[2, 3]], expected: 2 },
			{ input: [[-10, -5, 0, 20]], expected: -5 },
		],
		hints: ["Use nested loops first.", "The candidate loop decides what x is."],
		explanation:
			"Comments-first practice forces you to plan the loops before syntax takes over.",
		referenceSolution: `function solution(a) {
  let best = a[0];
  let bestSum = Infinity;
  for (const candidate of a) {
    let sum = 0;
    for (const value of a) sum += Math.abs(value - candidate);
    if (sum < bestSum) {
      bestSum = sum;
      best = candidate;
    }
  }
  return best;
}`,
	},
	{
		id: "blank-frequency-map",
		level: "Level 2",
		type: "blank-file",
		topic: "Objects",
		title: "Blank file: word counts",
		concept: "comments first / object map",
		prompt:
			"Start with comments. Then write solution(words) to return an object counting how many times each word appears.",
		signature: "function solution(words) { ... }",
		starter: `function solution(words) {
  // 1. Create an empty counts object
  // 2. Loop over every word
  // 3. If the word is not in counts yet, start it at 0
  // 4. Add 1 to that word's count
  // 5. Return counts

}
`,
		tests: [
			{ input: [["apple", "pear", "apple"]], expected: { apple: 2, pear: 1 } },
			{ input: [["x", "x", "y"]], expected: { x: 2, y: 1 } },
			{ input: [[]], expected: {} },
		],
		hints: [
			"Use an object as a dictionary.",
			"Increment the current word's count.",
		],
		explanation:
			"This is the exact pattern behind many object-map interview questions.",
		referenceSolution: `function solution(words) {
  const counts = {};
  for (const word of words) {
    counts[word] = (counts[word] || 0) + 1;
  }
  return counts;
}`,
	},
	{
		id: "blank-two-sum",
		level: "Level 3",
		type: "blank-file",
		topic: "Sets & Maps",
		title: "Blank file: two-sum boolean",
		concept: "comments first / Set",
		prompt:
			"Start with comments. Then write solution(nums, target) to return true if two different numbers add up to target.",
		signature: "function solution(nums, target) { ... }",
		starter: `function solution(nums, target) {
  // 1. Create a Set for numbers already seen
  // 2. For each number, calculate what number is needed to reach target
  // 3. If the needed number was already seen, return true
  // 4. Otherwise add the current number to seen
  // 5. Return false if no pair is found

}
`,
		tests: [
			{ input: [[2, 7, 11, 15], 9], expected: true },
			{ input: [[1, 2, 3], 10], expected: false },
			{ input: [[3, 3], 6], expected: true },
		],
		hints: [
			"The complement is target - num.",
			"Check seen before adding the current number.",
		],
		explanation:
			"Two-sum is really a complement lookup problem, not a nested-loop requirement.",
		referenceSolution: `function solution(nums, target) {
  const seen = new Set();
  for (const num of nums) {
    if (seen.has(target - num)) return true;
    seen.add(num);
  }
  return false;
}`,
	},
	{
		id: "array-map-output",
		level: "Level 1",
		type: "mcq",
		topic: "Arrays",
		title: "What does map return?",
		concept: "map / transformation",
		prompt: "What does nums.map((num) => num * 2) return for [1, 2, 3]?",
		choices: [
			{ id: "a", label: "[2, 4, 6]" },
			{ id: "b", label: "[1, 2, 3, 2]" },
			{ id: "c", label: "6" },
			{ id: "d", label: "undefined" },
		],
		correctChoiceId: "a",
		hints: [
			"map returns a new array.",
			"Each original value is transformed once.",
		],
		explanation:
			"map keeps the same length and transforms each element, so [1, 2, 3] becomes [2, 4, 6].",
	},
	{
		id: "object-key-meaning",
		level: "Level 1",
		type: "mcq",
		topic: "Objects",
		title: "What is an object key?",
		concept: "object properties",
		prompt: "In { name: 'Ada' }, what is name?",
		choices: [
			{ id: "a", label: "A property key that names the stored value" },
			{ id: "b", label: "A variable that must already exist" },
			{ id: "c", label: "A reserved JavaScript keyword" },
			{ id: "d", label: "The object's prototype" },
		],
		correctChoiceId: "a",
		hints: [
			"The key is how you look up the value.",
			"Keys can often be any useful property name.",
		],
		explanation:
			"Object keys are property names. They identify values inside the object.",
	},
	{
		id: "string-immutability",
		level: "Level 2",
		type: "mcq",
		topic: "Strings",
		title: "Why do string methods return new values?",
		concept: "immutability",
		prompt:
			"Why does str.toUpperCase() return a new string instead of changing str in place?",
		choices: [
			{ id: "a", label: "JavaScript strings are immutable" },
			{ id: "b", label: "toUpperCase is asynchronous" },
			{ id: "c", label: "Only arrays can hold letters" },
			{ id: "d", label: "The original string is deleted" },
		],
		correctChoiceId: "a",
		hints: [
			"Immutable means not changed in place.",
			"Assign the returned value if you want to keep it.",
		],
		explanation:
			"String operations create new strings because the original string value cannot be mutated.",
	},
	{
		id: "set-membership-cost",
		level: "Level 2",
		type: "mcq",
		topic: "Sets & Maps",
		title: "Why use a Set for duplicate checks?",
		concept: "membership lookup",
		prompt: "What is the main reason a Set helps with duplicate detection?",
		choices: [
			{
				id: "a",
				label: "It supports fast membership checks for previously seen values",
			},
			{ id: "b", label: "It sorts all numbers automatically" },
			{ id: "c", label: "It stores duplicate copies of every value" },
			{ id: "d", label: "It converts numbers into strings" },
		],
		correctChoiceId: "a",
		hints: [
			"Think about seen.has(value).",
			"Avoid scanning the whole array repeatedly.",
		],
		explanation:
			"A Set can answer whether a value has been seen before without a nested scan.",
	},
	{
		id: "recursion-base-case",
		level: "Level 2",
		type: "mcq",
		topic: "Recursion Basics",
		title: "What is a base case?",
		concept: "recursion",
		prompt: "In a recursive function, what does the base case do?",
		choices: [
			{ id: "a", label: "Stops recursion by returning a direct answer" },
			{ id: "b", label: "Makes the function call itself forever" },
			{ id: "c", label: "Deletes the call stack" },
			{ id: "d", label: "Runs only after every loop finishes" },
		],
		correctChoiceId: "a",
		hints: [
			"Without it, recursion usually never stops.",
			"It handles the smallest problem directly.",
		],
		explanation:
			"The base case is the stopping condition that returns without another recursive call.",
	},
	{
		id: "big-o-nested-loop",
		level: "Level 2",
		type: "mcq",
		topic: "Big-O",
		title: "Nested loop complexity",
		concept: "time complexity",
		prompt:
			"If one loop over n items contains another loop over n items, what is the usual time complexity?",
		choices: [
			{ id: "a", label: "O(n^2)" },
			{ id: "b", label: "O(n)" },
			{ id: "c", label: "O(log n)" },
			{ id: "d", label: "O(1)" },
		],
		correctChoiceId: "a",
		hints: [
			"For every outer item, the inner loop can scan n items.",
			"n times n is n squared.",
		],
		explanation:
			"Nested loops over the same input usually multiply into O(n^2).",
	},
	{
		id: "promise-then-order",
		level: "Level 3",
		type: "mcq",
		topic: "Async JS",
		title: "Promise callback timing",
		concept: "microtasks",
		prompt:
			"When does a resolved Promise's .then callback run relative to synchronous code?",
		choices: [
			{ id: "a", label: "After the current synchronous call stack finishes" },
			{ id: "b", label: "Before the next line of synchronous code" },
			{ id: "c", label: "Only after one full second" },
			{ id: "d", label: "Never, if already resolved" },
		],
		correctChoiceId: "a",
		hints: [
			"Promise callbacks are microtasks.",
			"Synchronous code keeps running first.",
		],
		explanation:
			"Promise reactions run after the current stack clears, before later macrotasks like timers.",
	},
	{
		id: "ts-union-narrowing",
		level: "Level 3",
		type: "mcq",
		topic: "Mixed Interview",
		title: "TypeScript union narrowing",
		concept: "discriminated unions",
		prompt:
			"Why is a type field useful in a TypeScript union like { type: 'code' } | { type: 'mcq' }?",
		choices: [
			{
				id: "a",
				label: "It lets TypeScript narrow to the matching object shape",
			},
			{ id: "b", label: "It makes runtime code execute faster automatically" },
			{ id: "c", label: "It prevents arrays from being created" },
			{ id: "d", label: "It replaces all tests" },
		],
		correctChoiceId: "a",
		hints: [
			"The shared field distinguishes the variants.",
			"After checking type, variant-specific fields are safe.",
		],
		explanation:
			"A discriminant field lets TypeScript know which fields exist inside a branch.",
	},
	{
		id: "sum-array",
		level: "Level 1",
		type: "code",
		topic: "Arrays",
		title: "Sum an array",
		concept: "loops / accumulation",
		prompt:
			"Write solution(nums) to return the sum of all numbers in the array.",
		signature: "function solution(nums) { ... }",
		starter: `function solution(nums) {
  // add every number
}
`,
		tests: [
			{ input: [[1, 2, 3]], expected: 6 },
			{ input: [[]], expected: 0 },
			{ input: [[-2, 5]], expected: 3 },
		],
		hints: ["Start total at 0.", "Add each number to the running total."],
		explanation:
			"Accumulation problems keep a running value and return it after the loop.",
		referenceSolution: `function solution(nums) {
  let total = 0;
  for (const num of nums) total += num;
  return total;
}`,
	},
	{
		id: "capitalize-words",
		level: "Level 2",
		type: "code",
		topic: "Strings",
		title: "Capitalize words",
		concept: "split / map / join",
		prompt:
			"Write solution(sentence) to capitalize the first letter of every space-separated word.",
		signature: "function solution(sentence) { ... }",
		starter: `function solution(sentence) {
  // capitalize every word
}
`,
		tests: [
			{ input: ["hello world"], expected: "Hello World" },
			{ input: ["a fine day"], expected: "A Fine Day" },
			{ input: [""], expected: "" },
		],
		hints: [
			"Split on spaces.",
			"For each word, uppercase word[0] and append the rest.",
		],
		explanation: "This combines string slicing with array transformation.",
		referenceSolution: `function solution(sentence) {
  if (sentence === "") return "";
  return sentence
    .split(" ")
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(" ");
}`,
	},
	{
		id: "group-by-role",
		level: "Level 3",
		type: "code",
		topic: "Objects",
		title: "Group users by role",
		concept: "object grouping",
		prompt:
			"Write solution(users) to return an object where each key is a role and each value is an array of user names with that role.",
		signature: "function solution(users) { ... }",
		starter: `function solution(users) {
  // group names by user.role
}
`,
		tests: [
			{
				input: [
					[
						{ name: "Ada", role: "admin" },
						{ name: "Lin", role: "user" },
						{ name: "Bo", role: "admin" },
					],
				],
				expected: { admin: ["Ada", "Bo"], user: ["Lin"] },
			},
			{ input: [[]], expected: {} },
		],
		hints: [
			"Initialize result[user.role] to an array.",
			"Push user.name into the right bucket.",
		],
		explanation:
			"Grouping is a map-building pattern where each key points to a collection instead of a count.",
		referenceSolution: `function solution(users) {
  const groups = {};
  for (const user of users) {
    if (!groups[user.role]) groups[user.role] = [];
    groups[user.role].push(user.name);
  }
  return groups;
}`,
	},
	{
		id: "factorial-recursive",
		level: "Level 2",
		type: "code",
		topic: "Recursion Basics",
		title: "Factorial with recursion",
		concept: "base case / recursive step",
		prompt:
			"Write solution(n) to return n factorial. n will be a non-negative integer.",
		signature: "function solution(n) { ... }",
		starter: `function solution(n) {
  // base case first
}
`,
		tests: [
			{ input: [0], expected: 1 },
			{ input: [1], expected: 1 },
			{ input: [5], expected: 120 },
		],
		hints: ["0! and 1! are both 1.", "n! is n * (n - 1)!."],
		explanation:
			"Recursive factorial is small enough to show the base case and shrinking input clearly.",
		referenceSolution: `function solution(n) {
  if (n <= 1) return 1;
  return n * solution(n - 1);
}`,
	},
	{
		id: "valid-parentheses-simple",
		level: "Level 3",
		type: "code",
		topic: "Mixed Interview",
		title: "Validate parentheses",
		concept: "stack",
		prompt:
			"Write solution(str) to return true when every '(' has a matching ')' in the correct order. The string contains only parentheses.",
		signature: "function solution(str) { ... }",
		starter: `function solution(str) {
  // track open parentheses
}
`,
		tests: [
			{ input: ["()()"], expected: true },
			{ input: ["(())"], expected: true },
			{ input: [")("], expected: false },
			{ input: ["(()"], expected: false },
		],
		hints: [
			"Increment for '(' and decrement for ')'.",
			"The count should never go below zero.",
		],
		explanation:
			"A counter works for one bracket type; a real stack is needed for multiple bracket types.",
		referenceSolution: `function solution(str) {
  let open = 0;
  for (const char of str) {
    if (char === "(") open++;
    else open--;
    if (open < 0) return false;
  }
  return open === 0;
}`,
	},
	{
		id: "translate-async-order",
		level: "Level 3",
		type: "english",
		topic: "Async JS",
		title: "Explain async logging order",
		concept: "microtasks / call stack",
		prompt: "Explain why this logs A, C, B.",
		code: `console.log("A");
Promise.resolve().then(() => console.log("B"));
console.log("C");`,
		keywords: ["synchronous", "promise", "then", "after", "stack", "microtask"],
		expected:
			"A and C log during synchronous execution. The Promise then callback is queued as a microtask and runs after the current call stack finishes, so B logs last.",
		hints: [
			"Synchronous logs run immediately.",
			"Promise callbacks wait for the current stack to clear.",
		],
		explanation:
			"Async ordering questions test whether you can separate call-stack work from queued callbacks.",
	},
	{
		id: "translate-big-o-map-set",
		level: "Level 3",
		type: "english",
		topic: "Big-O",
		title: "Explain Set-based two sum complexity",
		concept: "time and space complexity",
		prompt: "Explain the time and space complexity of this approach.",
		code: `function solution(nums, target) {
  const seen = new Set();
  for (const num of nums) {
    if (seen.has(target - num)) return true;
    seen.add(num);
  }
  return false;
}`,
		keywords: ["O(n)", "time", "space", "set", "once", "lookup"],
		expected:
			"It runs in O(n) time because it scans the array once and uses Set lookups. It uses O(n) space in the worst case because the Set can store many values.",
		hints: [
			"Count how many times the array is scanned.",
			"The Set grows with input size.",
		],
		explanation:
			"Complexity explanations should mention both time and space when extra data structures are used.",
	},
	{
		id: "trace-recursive-factorial",
		level: "Level 2",
		type: "trace",
		topic: "Recursion Basics",
		title: "Trace factorial calls",
		concept: "recursive multiplication",
		prompt:
			"For factorial(4), enter the returned values while the stack unwinds for n = 1, 2, 3, 4, then the final answer.",
		values: [1, 2, 3, 4],
		expectedSums: [1, 2, 6, 24],
		expectedAnswer: 24,
		hints: [
			"The base return is 1.",
			"Each caller multiplies n by the smaller result.",
		],
		explanation:
			"Recursion first descends to the base case, then builds answers as calls return.",
	},
	{
		id: "blank-recursive-sum",
		level: "Level 2",
		type: "blank-file",
		topic: "Recursion Basics",
		title: "Blank file: recursive sum",
		concept: "base case / smaller input",
		prompt: "Write solution(nums) recursively to return the sum of an array.",
		signature: "function solution(nums) { ... }",
		starter: `function solution(nums) {
  // 1. If the array is empty, return 0
  // 2. Return the first number plus the sum of the rest

}
`,
		tests: [
			{ input: [[1, 2, 3]], expected: 6 },
			{ input: [[]], expected: 0 },
			{ input: [[5]], expected: 5 },
		],
		hints: [
			"Empty array is the base case.",
			"Use nums.slice(1) for the smaller problem.",
		],
		explanation:
			"Recursive array problems need a smaller array and a base case that stops slicing.",
		referenceSolution: `function solution(nums) {
  if (nums.length === 0) return 0;
  return nums[0] + solution(nums.slice(1));
}`,
	},
	{
		id: "blank-big-o-improve-duplicates",
		level: "Level 3",
		type: "blank-file",
		topic: "Big-O",
		title: "Blank file: improve duplicate detection",
		concept: "from O(n^2) to O(n)",
		prompt:
			"Write solution(nums) to return true if the array contains any duplicate. Use a Set instead of nested loops.",
		signature: "function solution(nums) { ... }",
		starter: `function solution(nums) {
  // 1. Create a Set
  // 2. For each number, check whether it was seen
  // 3. Return true on duplicate
  // 4. Return false after the loop

}
`,
		tests: [
			{ input: [[1, 2, 3]], expected: false },
			{ input: [[1, 2, 1]], expected: true },
			{ input: [[]], expected: false },
		],
		hints: ["The Set is the memory of prior values.", "Check before adding."],
		explanation:
			"Using a Set trades O(n) extra space for O(n) time instead of comparing every pair.",
		referenceSolution: `function solution(nums) {
  const seen = new Set();
  for (const num of nums) {
    if (seen.has(num)) return true;
    seen.add(num);
  }
  return false;
}`,
	},
	{
		id: "async-await-error",
		level: "Level 3",
		type: "mcq",
		topic: "Async JS",
		title: "Catching await errors",
		concept: "async / await",
		prompt:
			"Inside an async function, what is the usual way to handle a rejected awaited Promise?",
		choices: [
			{ id: "a", label: "Wrap the await in try/catch" },
			{ id: "b", label: "Use a for loop around the Promise" },
			{ id: "c", label: "Call JSON.stringify on the Promise" },
			{ id: "d", label: "Rejected Promises cannot be handled" },
		],
		correctChoiceId: "a",
		hints: [
			"await makes rejection behave like a thrown error.",
			"Thrown errors are handled with catch.",
		],
		explanation:
			"try/catch around await gives synchronous-looking error handling for rejected Promises.",
	},
	{
		id: "array-find-vs-filter",
		level: "Level 2",
		type: "mcq",
		topic: "Arrays",
		title: "find versus filter",
		concept: "array search",
		prompt:
			"Which method returns the first matching element instead of all matching elements?",
		choices: [
			{ id: "a", label: "find" },
			{ id: "b", label: "filter" },
			{ id: "c", label: "map" },
			{ id: "d", label: "reduce" },
		],
		correctChoiceId: "a",
		hints: [
			"filter always returns an array.",
			"find returns one value or undefined.",
		],
		explanation:
			"find is for one matching item; filter is for a new array of every match.",
	},
	{
		id: "one-bits-positions",
		level: "Level 3",
		type: "code",
		topic: "Mixed Interview",
		title: "Find one bits in a binary number",
		concept: "binary representation / string conversion",
		prompt:
			"Write solution(n) to return an array whose first item is the number of 1 bits in n's binary representation, followed by the 1-based positions of those bits from left to right.",
		signature: "function solution(n) { ... }",
		starter: `function solution(n) {
  // Convert n to binary, then return [count, ...positions]
}
`,
		tests: [
			{ input: [37], expected: [3, 1, 4, 6] },
			{ input: [5], expected: [2, 1, 3] },
			{ input: [8], expected: [1, 1] },
			{ input: [0], expected: [0] },
			{ input: [161], expected: [3, 1, 3, 8] },
		],
		hints: [
			"JavaScript numbers have a toString(radix) method. n.toString(2) returns the number written in binary.",
			'After converting to a string, split it into characters and scan for the character "1".',
			"The positions in this drill are 1-based, so push index + 1.",
		],
		explanation:
			'This drill is about binary representation and API discovery. Decimal numbers can be written in different bases; base 2 is binary, and JavaScript exposes that with n.toString(2). Once n is a binary string, the problem becomes a normal string/array scan: count the "1" characters and record their 1-based positions from left to right. That hidden toString(2) trick is exactly the kind of language-specific tool interview practice should teach instead of assuming you magically know it.',
		referenceSolution: `function solution(n) {
  const bits = n.toString(2).split("");
  const positions = [];

  bits.forEach((bit, index) => {
    if (bit === "1") positions.push(index + 1);
  });

  return [positions.length, ...positions];
}`,
	},
];
