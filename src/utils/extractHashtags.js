export default function extractHashtags(text) {
  var regexp = /\B#\w\w+\b/g;
  return text.match(regexp);
}
