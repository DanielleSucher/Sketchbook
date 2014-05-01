## Homophones with wildly different spellings
&nbsp;  
I've been working on search implementation stuff lately, and we needed wordlists for testing that had words which are similarly phonetically encoded but spelled very differently.  
&nbsp;  
Here are a couple of such wordlists that I generated, and the Python script I wrote to generate them, in case you ever need such a thing.  
&nbsp;  
Each line in these wordlists has a set of words that are identically phonetically encoded (comparing only the first Double Metaphone encoding), but are spelled very differently (meaning, which share no more than a quarter of their trigrams).
&nbsp;  
&nbsp;  
##Requirements
* Python 2.7.2(ish)
* [Metaphone](https://github.com/oubiwann/metaphone/)