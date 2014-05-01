import itertools
import string
from metaphone import doublemetaphone


class HomophoneDictionary:
  def __init__(self, input_file, min_chars=6, cutoff_denominator=4):
    self.input_file = input_file
    self.min_chars = min_chars
    self.cutoff_denominator = cutoff_denominator

  def create_soundalikes_wordlist(self):
    words = {}
    wordlist = open(self.input_file, 'r')
    for line in wordlist:
      word = string.rstrip(line)
      phonemes = doublemetaphone(word)[0]
      word_info = words.setdefault(phonemes, self.__default_word_info())
      word_info['graphemes'].append(word)
      self.__mark_inappropriate(word_info, word)
    wordlist.close()
    self.__export_wordlist(words)

  def __default_word_info(self):
    return {
      'graphemes': [],
      'trigrams': [],
      'inappropriate': False,
      'trigram_cutoff': 1
    }

  def __export_wordlist(self, words):
    for word_info in words.values():
      if self.__exportable(word_info):
        print(','.join(word_info['graphemes']))

  def __exportable(self, word_info):
    return len(word_info['graphemes']) > 1 and not word_info['inappropriate']

  def __mark_inappropriate(self, word_info, word):
    if len(word) < self.min_chars:
      word_info['inappropriate'] = True
    if not word_info['inappropriate']:
      self.__check_trigrams(word_info, word)

  def __check_trigrams(self, word_info, word):
    trigrams = self.__trigrams(word)
    not_first = len(word_info['graphemes']) > 1
    if not_first and self.__spelling_too_similar(word_info, trigrams):
      word_info['inappropriate'] = True
    self.__update_word_info(word_info, trigrams)

  def __max_matching_trigrams(self, word_info, trigrams):
    max_matching = 0
    for old_trigrams in word_info['trigrams']:
      find_match = lambda x: x in old_trigrams
      matching = len(list(itertools.ifilter(find_match, trigrams)))
      max_matching = max(matching, max_matching)
    return max_matching

  def __spelling_too_similar(self, word_info, trigrams):
    max_matching = self.__max_matching_trigrams(word_info, trigrams) 
    return max_matching > word_info['trigram_cutoff']

  def __trigrams(self, word): 
    padded = ' ' + word + ' '
    count = len(padded) - 3
    return [padded[i:i+3] for i in range(count)] 

  def __update_word_info(self, word_info, trigrams):
    word_info['trigrams'].append(trigrams)
    new_cutoff = len(trigrams)/self.cutoff_denominator
    word_info['trigram_cutoff'] = max(word_info['trigram_cutoff'], new_cutoff)
       

if __name__ == '__main__':
  term = open('/dev/tty', 'w+')
  term.write('What is the path to your input wordlist?\n>> ')
  input_file = raw_input().lower()
  term.close()

  HomophoneDictionary(input_file).create_soundalikes_wordlist()
