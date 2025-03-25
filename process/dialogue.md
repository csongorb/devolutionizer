# Devolutionizer - Process Dialogue

## 2025-02-14 Csongor: Let's do this!

Ohnooo, why this title?!  
I had to pick one for the repository, I'm really afraid it's going to stick. We'll need to find another one.  

Hey Haniyeh,  
Sorry for doing it like this, just opening a repo. I still feel that you are looking for your right role in Devolution, and among many other things, I feel strongly that this could be a good one.  

But what do I mean? At the core:  
https://github.com/csongorb/growingstuff/blob/main/process/dialogue.md#2025-01-24-csongor-devolutionizer  
Would you be interested?

The more I think about it, it has to be a kind of two-step system, as light as possible:

1. **Editor** that "eats" a repository and allows the curator/researcher to select certain commits to highlight, and maybe some additional settings to analyse/exhibit the repository, and maybe some other settings to customise the design.
2. **Player**, which allows a visitor/researcher to play the different (selected) versions, compare them, check additional info about the repo. As our main concern now are the games of Pippin Barr: maybe directly in the browser (fullscreen, 2 screens?).

Lots of open questions, for sure.  
What do you think?

## 2025-03-26 12:00 AM Haniyeh: Hi, Hey, Hello?


Hi Csongor,
Sorry for disappearing all of a sudden. There was the Persian New Year, and then on Sunday, I got food poisoning, and before that, I'm sure there was something else. 

You somehow managed to make communicating via commits sound cool and easy, but somehow I find it not quite so comfortable(?)

So, about the devolutionizing web app, you saw the first prototype 3 weeks ago (again, sorry for disappearing!) It had 2 main issues:
1. It worked with only the GitHub API
2. Using HTML/CSS was kind of limiting

I've started using node.js for the backend and React for the frontend. Now we can use any local repo we want and get all the commits even when offline.
What I've managed to do so far:
-be able to work with any GIT repo cloned
-Backend serving real commits
-Frontend fetching & displaying them
-Commit selection working

What I'm about to do right now (will be done by Thursday):
- be able to save selections in local storage (in Editor), so we can keep them even when the page is refreshed.
- Exhibition mode for "Player"
- Launch/View files in selected commits
  
After these are done, I'll have to polish the UI, using shadcn-ui (maybe?? I have no idea yet? I honestly have no idea what I'm doing half of the time I work with React.)

But! For now, I'll try to upload my progress without sabotaging the code. (Ultimately, I'll just upload a zip file with instructions? for now at least?)

((I WILL NOT DISAPPEAR AGAIN!))
