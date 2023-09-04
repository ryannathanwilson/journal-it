function isString(x: unknown): x is string {
  return typeof x === 'string';
}
export default function classes(...args: unknown[]): string {
  const listOfClasses = (args)
    .filter<string>((c): c is string => isString(c));
  return listOfClasses.join(' ')
}
