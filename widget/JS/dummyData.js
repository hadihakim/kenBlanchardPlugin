const apiCall = async () => {
  let post;
  try {
    let res = await fetch("https://fakestoreapi.com/products?limit=20");
    post = await res.json();
console.log(post);
    return post;
  } catch (error) {
    console.log(error);
  }
};

