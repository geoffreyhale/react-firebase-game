const countWords = (value) => value?.match(/\S+/g)?.length || 0;
export default countWords;
