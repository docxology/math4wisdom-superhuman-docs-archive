# Exploring 5-24-2024 Raudys

Can ask questions to the papers as [uploaded to Perplexity](https://www.perplexity.ai/search/Please-digest-and-CAC_WzSHRe2U9WYbQVsgRQ)

---

# Paper 1

Unlike many other investigations on this topic, the present one considers the non-linear single-layer perceptron (SLP) as a process in which the weights of the perceptron are increasing, and the cost function of the sum of squares is changing gradually. 

During the backpropagation training, the decision boundary of of SLP becomes identical or close to that of seven statistical classifiers: 

- (1) the Euclidean distance classifier, 

- (2) the regularized linear discriminant analysis, 

- (3) the standard Fisher linear discriminant function, 

- (4) the Fisher linear discriminant function with a pseudoinverse covariance matrix, 

- (5) the generalized Fisher discriminant function, 

- (6) the minimum empirical error classifier, and 

- (7) the maximum margin classifier. 

In order to obtain a wider range of classifiers, five new complexity-control techniques are proposed: target value control, moving of the learning data centre into the origin of coordinates, zero weight initialization, use of an additional negative weight decay term called ‘‘anti-regularization’’, and use of an exponentially increasing learning step. Which particular type of classifier will be obtained depends on the data, the cost function to be minimized, the optimization technique and its parameters, and the stopping criteria.

<columns>
On the beginning of section 2 —

- The sigmoid activation function is often used in Neural Networks. I am not sure why tanh() is used here rather than Sigmoid.
  - I asked [Perplexity](https://www.perplexity.ai/search/Why-use-tanh-GlJ4z6JTQoaXNfUo2IRzqg) “Why use tanh() rather than Sigmoid activation function in a classifier?” — the main reasons are:
    - Output range (tanh goes [-1,1] rather than [0,1] with zero-centring. 
    - Gradient, Convergence, and Accuracy properties 



|||


</columns>

---

# Paper 2

Evolution and generalization of a single neurone II. Complexity of statistical classifiers and sample size considerations

Unlike many other investigations on this topic, the present one does not consider the nonlinear SLP as a single special type of the classification rule. In SLP training we can obtain seven statistical classifiers of differing complexity: 

- (1) the Euclidean distance classifier; 

- (2) the standard Fisher linear discriminant function (DF); 

- (3) the Fisher linear DF with pseudo-inversion of the covariance matrix; 

- (4) regularized linear discriminant analysis; 

- (5) the generalized Fisher DF; 

- (6) the minimum empirical error classifier; and 

- (7) the maximum margin classifier. 

A survey of earlier and new results, referring to relationships between the complexity of six classifiers, generalization error, and the number of learning examples, is presented. These relationships depend on the complexities of both the classifier and the data. This knowledge indicates how to control the SLP classifier complexity purposefully by determining optimal values of the targets, learning-step and its change in the training process, the number of iterations, and addition or subtraction of a regularization term. A correct initialization of weights, and a simplifying data structure can help to reduce the generalization error

- Here we see review of past results (Reflection), positing of new Stands upon those reflections (e.g. given X limitation we could pursue avenue Y), and then in the paper II contributions Following Through with delivering results of some considerations related to Sample size and more.          [Andrius :)]

<columns>
“In the classical statistical approach, vector x to be classified into classes p1, p2 is assumed to be a random variable with a certain conditional probability density function f(x|pi). To estimate the structure of the classifier and its weight vector w, one uses assumptions on the probabilistic structure of f(x|pi), and learning-set observation vectors. To analyse a dependence of the generalization error on the structure of the classifier and the learning-set size, one uses standard statistical methods. This approach is considered in his paper. Among other approaches, the most popular are: a probable almost correct (PAC) framework (Valiant, 1984); the statistical mechanics approach; and the information-theoretic and statistical approach, based on statistical models of conditional density f(oi|w,xi) of the output oi of the network, f(xi), an unconditional density, and the standard technique of asymptotic statistical inference, which is valid under regularity conditions such as the existence of the moments of random variables and the existence of the Fisher information (see, e.g., Levin et al., 1990; Amari and Murata, 1993; Amari, 1993).”

- Many points of contact with the statistical physics (Bayesian Mechanics) in [https://coda.io/d/_d0SvdI3KSto/_suo0BIkP](https://coda.io/d/_d0SvdI3KSto/_suo0BIkP). [Andrius: Great!]
- How can we develop statistical power testing methods, such that proposed algorithms and developed model architectures/families, can be rapidly swept & assessed for empirical relevance and performance? 



|||


</columns>

---

# Paper 3

Evolution and generalization of a single neurone. III. Primitive, regularized, standard, robust and minimax regressions

We show that during training the single layer perceptron, one can obtain six conventional statistical regressions: 

- a primitive, 

- regularized, 

- standard,

- the standard with the pseudo-inversion of the covariance matrix, 

- robust, and 

- minimax (support vector). 

The complexity of the regression equation increases with an increase in the number of iterations.  
The generalization accuracy depends on the type of the regression obtained during the training, on the data, learning-set size, and, in certain cases, on the distribution of components of the weight vector.  
For small intrinsic dimensionality of the data and certain distributions of components of the weight vector the single layer perceptron can be trained even with very short learning sequences.  
The type of the regression obtained in SLP training should be controlled by the sort of cost function as well as by training parameters (the number of iterations, learning step, etc.). 

- Whitening data transformation prior to training the perceptron is a tool to incorporate a prior information into the prediction rule design, and helps both to diminish the generalization error and the training time.

  - This is heavily related to the [Statistical Parametric Mapping](https://www.fil.ion.ucl.ac.uk/spm/doc/) approach, from Karl Friston and others, doing sensor fusion & dynamic causal modeling on neuroimaging measurements. Here, analyzing/normalizing/calibrating the variance patterns of the fMRI experimental situation, is the key/central example. 

  - One way to think of this, is that there is the statistical patterns of interest (e.g. t Statistic, or Bayes Factor, for some voxel of interest). Then there are osciliatory and punctuated activities at time/space scales which are often co-occurant and also need to be de-noised in order to get to signal of interest (e.g. heart and lung effects on circulation, head movement, fMRI signal slow drift). 

  - SPM is built upon a generalized linear modeling (e.g. Additive effects as partitioned from correlated/uncorrelated [co]variance patterns), and characterizes from the perspectives of classical Parametric statistics, Non-parametric methods, and Bayesian statistics. 

    - Arguably the Bayesian and Non-parametric approaches, do something like approximate the generalized linear modeling. Perhaps that is related to Raudys’ work, e.g. showing that the capacities/expressivity of SLP/NN is such as to recapitulate some classical statistical results. Then there is the question like, have all the simple/best statistical descriptors (for example for a linear regression) been described? And/or are there other useful descriptors, and if so to what extent are they analytical and what extent empirical/procedural? 

  - “6. Concluding remarks” has many interesting summaries and implications. 

    -  Could this reflect some statistical patterns/normativities, which connect to....

      - ....(Constrained) Maximum Entropy / FEP / Statistical Physics

      - ....Discrete [https://coda.io/d/_d0SvdI3KSto/_suTEdstt](https://coda.io/d/_d0SvdI3KSto/_suTEdstt) arising to describe / heuristics / methods of “inquiry & action” (CJF [https://coda.io/d/_d0SvdI3KSto/_suQWY5DS](https://coda.io/d/_d0SvdI3KSto/_suQWY5DS)) for address these patterns practically (from 1st person perspective)? 

>> Code is provided.

>> % Find robust regression by % the nonlinear single layer perceptron % author Sarunas Raudys % ,raudys@das.mii.lt . % A input N*p array - training-set % Y target N*1 array- training-set % At input Nt*p array - test-set % Yt target Nt*1 array- test-set % iter - number of iterations % step - learning-step % Wstart - 1*(p 1 1) starting weight % vector % alfa - scaling parameter % W - 1*(p 1 1) final weight vector % et - generalization error history in % iter training iterations % prior to training we recommend: % - to substract from A,Y; At,Yt the sample % means of A,Y; % - to use Wstart ? zeros(1,p 1 1); % - whitening of a distribution of input % vector can be useful function [W,et] ? robustpc (A,Y,At,Yt,iter,step,Wstart,alfa) [N, p] ? size(A); [Nt, pt] ? size(At); W ? Wstart; stepalfa ? step/alfa; AA ? [A, ones(N,1)]; AAt ? [At, ones(Nt,1)]; for i ? 1:iter dist ? alfa*(Y 2 AA * W); ind ? find(abs(dist) , pi); W ? W 1 stepalfa * sin(dist(ind))*AA(ind,:); dt ? AAt*W 2 Yt; et(i) ? sqrt(dt*dt./Nt); end return



---



Going further and with [Perplexity](https://www.perplexity.ai/search/Please-digest-and-CAC_WzSHRe2U9WYbQVsgRQ)....

How would you contextualize and differentiate this work, in a table, among:

Rows: Neural Networks, Active Inference & Free Energy Principle, Diverse Intelligences  
Columns: Contextuality/Relationality of Raudys work, Differentiating factors, Unique explanations/predictions/capacities. 

5-24-2024 Perplexity Raudys



---



---



<columns>
From the Active Inference side, Livestream #051 series focused on the relationship between Active Inference type Bayesian Graphs, and Neural Networks. 

- The paper is Isomura et al. [Canonical neural networks perform active inference](https://www.nature.com/articles/s42003-021-02994-2) 
- [Slides](https://docs.google.com/presentation/d/1m8NZvPp_Jm9qVRn47DaluGHLTH5WyGt_IKqzemgULI4/edit#slide=id.g1430e5be42d_0_0)
  - Here we see the connection between Neural Network loss function & Bayesian Graph Free Energy. 
    - 
  - Importantly, operations and schedules ([https://coda.io/d/_d0SvdI3KSto/_suTEdstt](https://coda.io/d/_d0SvdI3KSto/_suTEdstt)) can be defined in the Bayesian Graph format, at a semantic/interpretable level that evades deep learning and neural network type system (though also see work in [transformer monosemanticity](https://transformer-circuits.pub/2024/scaling-monosemanticity/index.html)).  
    - 
    - Here we have forward anticipation and also retroactive learning. AND from the above, we know that there are (probably many/infinite) topologically-distinct bio/neuro-mimetic methods/tissues which can implement this Bayesian semantics (grounded in the Free Energy Principle, Bayesian Mechanics). 



|||

[#051.0](https://www.youtube.com/watch?v=ZASG-rtkXDk)

https://www.youtube.com/watch?v=ZASG-rtkXDk



|||

[#051.1](https://www.youtube.com/watch?v=IM_NlUzyq8M)

https://www.youtube.com/watch?v=IM_NlUzyq8M

|||

[#051.2](https://www.youtube.com/watch?v=hY_CajLpt9Q)

https://www.youtube.com/watch?v=hY_CajLpt9Q
</columns>

## **Some next questions**

- How can we continue to interpret and develop our understanding of the relationships among e.g. (Non-)Parametric statistics, Bayesian methods, Neural Networks? 

  - How can we connect the physics/math and philosophy from the “high road” with the models-as-constructed from the “low road”? 

    - [Figure 1.2 from 2022 Textbook](https://coda.io/d/ActInf-Textbook-Group_d4CkUI-iA_K/Figures_su1bB#Figure_tu1fA/r2) 

    - [Andrius: I find this diagram helpful, thank you, Daniel!]

- How do we think about statistical/noisy/variable empirical settings, with the seeming generality/fixedness of categorical abstractions like [https://coda.io/d/_d0SvdI3KSto/_suTEdstt](https://coda.io/d/_d0SvdI3KSto/_suTEdstt)?  

  - How do we connect the categorical “Divisions of Everything”, with statistics and probabilistic processes? 

    - As you are training the neural network, it starts to show behaviors/understandings/weights in ways that increase in sophistication. So.... What’s the difference between two classifiers? 

    - E.g. going from Euclidian to Fisher discrimination — the underlying statistics are adding in an idea. The logic of the categorization is getting layering in. 

      - If it is trained *in a certain way* — then move through gradually all of the 7 

    - What are the different Classifiers & Regressors assuming?  

- Give us a statistical deliberation/analysis — Reverse scientific method. 

  - Identify what kind of [https://coda.io/d/_d0SvdI3KSto/_su9mLmih](https://coda.io/d/_d0SvdI3KSto/_su9mLmih), assumptions, [https://coda.io/d/_d0SvdI3KSto/_suTEdstt](https://coda.io/d/_d0SvdI3KSto/_suTEdstt) are underlying.

  - Surveying ways of figuring things out in statistics. 

- How does [https://coda.io/d/_d0SvdI3KSto/_suHQAYwy](https://coda.io/d/_d0SvdI3KSto/_suHQAYwy) relate to [https://coda.io/d/_d0SvdI3KSto/_suaIR30W](https://coda.io/d/_d0SvdI3KSto/_suaIR30W)? 

  - Person doing the training of the neurons — can do this so that the neuron/net grows in sophistication, as given by the classifier type. 

- How could it relate to [https://coda.io/d/_d0SvdI3KSto/_su_54_O3](https://coda.io/d/_d0SvdI3KSto/_su_54_O3)? 

  - Raudys — only developing in a certain way/order. 

  - Spherical error profiles — iid. 

  - Bott periodicity and CPT symmetry also relate to random matrix ensembles: Gaussian orthogonal, Gaussian unitary and Gaussian symplectic.

  - Classifier — especially the binary case. [https://coda.io/d/_d0SvdI3KSto/_su_54_O3](https://coda.io/d/_d0SvdI3KSto/_su_54_O3) — every time you add linear structure, you are preserving the half/class that commutes, and the half/class that does not. 



Hello Andrius <formula id="f-AAu0b1CG2c">Andrius Kulikauskas</formula> 

This page [https://coda.io/d/_d0SvdI3KSto/_suQtMg3f](https://coda.io/d/_d0SvdI3KSto/_suQtMg3f) has my notes from last few days reading about the [https://coda.io/d/_d0SvdI3KSto/_suHQAYwy](https://coda.io/d/_d0SvdI3KSto/_suHQAYwy).

I will look forward to talking tomorrow <formula id="f-RsXdEsl2hJ">5/28/2024</formula> and hearing from you.  
Also for that meeting, I can only stay for the first 30 minutes (shortened the calendar event).

Peace,

Daniel  



Thank you, Daniel! <formula id="f-sX3YajTuXq">Daniel Ari Friedman</formula> 

I look forward to talking with you for one half hour.

I want to think how the statistical classifiers may relate to divisions of everything.  I suspect that the n-th classifier makes use of n conceptual perspectives.

I will see if I can express that to you and if you can help me understand the qualitiative distinctions between the classifiers. 

I imagine there may be connections with Bott periodicity in modeling divisions of everything. He suggests using spherical distributions. Bott periodicity is very much about spherical symmetries in various dimensions, including orthogonal (real), unitary (complex) and symplectic (quaternion), both rotations and reflections.

I wonder how rotations and reflections come up with the statistical classifiers.

Bott periodicity and CPT symmetry also relate to [random matrix ensembles](https://en.wikipedia.org/wiki/Random_matrix#Gaussian_ensembles): Gaussian orthogonal, Gaussian unitary and Gaussian symplectic.

Thank you for spending so much time on these articles. I will try to likewise delve into them.

Andrius
