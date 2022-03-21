export default async function handler(req, res) {
  const { url } = req.body ? JSON.parse(req.body) : {};

  let results;

  try {
    results = await fetch(`https://production-code-snippets.cloudinary.com/v1/generate-code-snippets?agentId=swagger&sdkIds=js_2&url=${encodeURIComponent(url)}`)
      .then(r => r.json());
  } catch(e) {
    console.log('Failed get transformations', e);
    res.status(500).json({
      message: 'Failed get transformations'
    });
    return;
  }

  res.status(200).json({
    ...results
  });
}