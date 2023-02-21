This uses the hugging face free inference model to play with the new Microsoft BioGPT model.

I recommend writing your input as if you are writing a paper, and it will basically act as a smart autosuggest. If you give it a well-formatted question it thinks it is the title of the paper and will try to give you the rest of it.

![terminal example](./example.gif)

This API is free, but it runs on CPU not GPU and therefore is so slow that it can generate about 1 word per call. Please be patient with it.

# Installation
You will need to have Docker installed on your system to run via the dockerfile. If you have all the other dependencies (mainly nodejs) you can run via `npm start`.

# Run
## Running command line app via Docker
`docker build -t biogpt .`

then 

`docker run --rm -ti biogpt`

It will then ask you to write input and it will run that against the model. 