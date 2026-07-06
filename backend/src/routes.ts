import { Router, Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import { getDb } from './db';
import { requireAdmin, verifyGoogleToken, generateToken } from './auth';
import { getConnectivityStats } from './monitor';

const router = Router();
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'myemail@gmail.com';

// --- AUTHENTICATION ---

router.post('/auth/google', async (req: Request, res: Response) => {
  const { idToken } = req.body;
  if (!idToken) {
    return res.status(400).json({ error: 'Google ID token is required' });
  }

  // Developer bypass for local development/testing without Google OAuth configured
  const JWT_SECRET = process.env.JWT_SECRET || 'your_fallback_super_secret_jwt_key_12345';
  if (idToken === 'dev-bypass' || idToken === JWT_SECRET) {
    const token = generateToken({
      email: ADMIN_EMAIL,
      name: 'Local Dev Admin',
      picture: '',
      role: 'admin'
    });
    return res.json({ token, user: { email: ADMIN_EMAIL, name: 'Local Dev Admin' } });
  }

  try {
    const googleUser = await verifyGoogleToken(idToken);
    
    if (googleUser.email !== ADMIN_EMAIL) {
      return res.status(403).json({ error: 'Access Denied: You are not authorized to access this panel.' });
    }

    const token = generateToken({
      email: googleUser.email,
      name: googleUser.name,
      picture: googleUser.picture,
      role: 'admin'
    });

    return res.json({ token, user: googleUser });
  } catch (error: any) {
    return res.status(401).json({ error: error.message || 'Authentication failed' });
  }
});

router.get('/auth/me', requireAdmin, (req: Request, res: Response) => {
  return res.json({ user: (req as any).admin });
});

router.get('/connectivity/stats', requireAdmin, async (req: Request, res: Response) => {
  try {
    const stats = await getConnectivityStats();
    return res.json(stats);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});


// --- CLIENTS CRUD ---

router.get('/clients', requireAdmin, async (req: Request, res: Response) => {
  try {
    const db = getDb();
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = (req.query.search as string) || '';
    const status = (req.query.status as string) || '';

    const query: any = { deletedAt: null };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    if (status) {
      query.status = status;
    }

    const total = await db.collection('clients').countDocuments(query);
    const clients = await db.collection('clients')
      .find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray();

    return res.json({
      clients,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

router.post('/clients', requireAdmin, async (req: Request, res: Response) => {
  try {
    const db = getDb();
    const { name, company, email, phone, address, country, website, notes, status } = req.body;

    if (!name || !email) {
      return res.status(400).json({ error: 'Name and Email are required' });
    }

    const newClient = {
      name,
      company: company || '',
      email,
      phone: phone || '',
      address: address || '',
      country: country || '',
      website: website || '',
      notes: notes || '',
      status: status || 'Active',
      createdAt: new Date(),
      deletedAt: null
    };

    const result = await db.collection('clients').insertOne(newClient);
    return res.status(201).json({ _id: result.insertedId, ...newClient });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

router.put('/clients/:id', requireAdmin, async (req: Request, res: Response) => {
  try {
    const db = getDb();
    const id = req.params.id;
    const updateData = { ...req.body };
    delete updateData._id;

    const result = await db.collection('clients').findOneAndUpdate(
      { _id: new ObjectId(id), deletedAt: null },
      { $set: updateData },
      { returnDocument: 'after' }
    );

    if (!result) {
      return res.status(404).json({ error: 'Client not found' });
    }

    return res.json(result);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

router.delete('/clients/:id', requireAdmin, async (req: Request, res: Response) => {
  try {
    const db = getDb();
    const id = req.params.id;

    // Soft delete: set deletedAt
    const result = await db.collection('clients').findOneAndUpdate(
      { _id: new ObjectId(id), deletedAt: null },
      { $set: { deletedAt: new Date() } }
    );

    if (!result) {
      return res.status(404).json({ error: 'Client not found or already deleted' });
    }

    return res.json({ message: 'Client soft-deleted successfully' });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});


// --- PROJECTS CRUD ---

router.get('/projects', requireAdmin, async (req: Request, res: Response) => {
  try {
    const db = getDb();
    const search = (req.query.search as string) || '';
    const status = (req.query.status as string) || '';

    const query: any = { deletedAt: null };

    if (search) {
      query.$or = [
        { projectName: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    if (status) {
      query.status = status;
    }

    // Return all projects, and populate client details
    const projects = await db.collection('projects')
      .aggregate([
        { $match: query },
        {
          $addFields: {
            clientIdObj: {
              $cond: {
                if: { $and: [{ $ne: ["$clientId", ""] }, { $ne: ["$clientId", null] }] },
                then: { $toObjectId: "$clientId" },
                else: null
              }
            }
          }
        },
        {
          $lookup: {
            from: 'clients',
            localField: 'clientIdObj',
            foreignField: '_id',
            as: 'clientDetails'
          }
        },
        {
          $unwind: {
            path: '$clientDetails',
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $project: {
            clientIdObj: 0
          }
        }
      ]).toArray();

    return res.json(projects);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

router.post('/projects', requireAdmin, async (req: Request, res: Response) => {
  try {
    const db = getDb();
    const {
      projectName, clientId, description, technology, budget, currency,
      status, priority, progress, startDate, deadline, githubLink, liveUrl, notes
    } = req.body;

    if (!projectName) {
      return res.status(400).json({ error: 'Project Name is required' });
    }

    const newProject = {
      projectName,
      clientId: clientId || null,
      description: description || '',
      technology: Array.isArray(technology) ? technology : (technology ? technology.split(',').map((t: string) => t.trim()) : []),
      budget: parseFloat(budget) || 0,
      currency: currency || 'USD',
      status: status || 'Planning',
      priority: priority || 'Medium',
      progress: parseInt(progress) || 0,
      startDate: startDate || '',
      deadline: deadline || '',
      githubLink: githubLink || '',
      liveUrl: liveUrl || '',
      notes: notes || '',
      createdAt: new Date(),
      deletedAt: null
    };

    const result = await db.collection('projects').insertOne(newProject);
    return res.status(201).json({ _id: result.insertedId, ...newProject });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

router.put('/projects/:id', requireAdmin, async (req: Request, res: Response) => {
  try {
    const db = getDb();
    const id = req.params.id;
    const updateData = { ...req.body };
    delete updateData._id;

    if (updateData.technology && typeof updateData.technology === 'string') {
      updateData.technology = updateData.technology.split(',').map((t: string) => t.trim());
    }
    if (updateData.budget) updateData.budget = parseFloat(updateData.budget);
    if (updateData.progress !== undefined) updateData.progress = parseInt(updateData.progress);

    const result = await db.collection('projects').findOneAndUpdate(
      { _id: new ObjectId(id), deletedAt: null },
      { $set: updateData },
      { returnDocument: 'after' }
    );

    if (!result) {
      return res.status(404).json({ error: 'Project not found' });
    }

    return res.json(result);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

router.delete('/projects/:id', requireAdmin, async (req: Request, res: Response) => {
  try {
    const db = getDb();
    const id = req.params.id;

    const result = await db.collection('projects').findOneAndUpdate(
      { _id: new ObjectId(id), deletedAt: null },
      { $set: { deletedAt: new Date() } }
    );

    if (!result) {
      return res.status(404).json({ error: 'Project not found' });
    }

    return res.json({ message: 'Project soft-deleted successfully' });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});


// --- INVOICES CRUD ---

router.get('/invoices', requireAdmin, async (req: Request, res: Response) => {
  try {
    const db = getDb();
    const query: any = { deletedAt: null };

    const invoices = await db.collection('invoices')
      .aggregate([
        { $match: query },
        {
          $addFields: {
            clientIdObj: {
              $cond: {
                if: { $and: [{ $ne: ["$clientId", ""] }, { $ne: ["$clientId", null] }] },
                then: { $toObjectId: "$clientId" },
                else: null
              }
            },
            projectIdObj: {
              $cond: {
                if: { $and: [{ $ne: ["$projectId", ""] }, { $ne: ["$projectId", null] }] },
                then: { $toObjectId: "$projectId" },
                else: null
              }
            }
          }
        },
        {
          $lookup: {
            from: 'clients',
            localField: 'clientIdObj',
            foreignField: '_id',
            as: 'clientDetails'
          }
        },
        {
          $unwind: {
            path: '$clientDetails',
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $lookup: {
            from: 'projects',
            localField: 'projectIdObj',
            foreignField: '_id',
            as: 'projectDetails'
          }
        },
        {
          $unwind: {
            path: '$projectDetails',
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $project: {
            clientIdObj: 0,
            projectIdObj: 0
          }
        }
      ]).toArray();

    return res.json(invoices);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

router.post('/invoices', requireAdmin, async (req: Request, res: Response) => {
  try {
    const db = getDb();
    const {
      invoiceNumber, issueDate, dueDate, clientId, projectId, currency,
      tax, discount, paymentMethod, notes, items, status
    } = req.body;

    if (!invoiceNumber || !clientId) {
      return res.status(400).json({ error: 'Invoice Number and Client are required' });
    }

    // Subtotal and Grandtotal Calculations
    const processedItems = (items || []).map((item: any) => ({
      description: item.description || '',
      quantity: parseFloat(item.quantity) || 0,
      unitPrice: parseFloat(item.unitPrice) || 0,
      total: (parseFloat(item.quantity) || 0) * (parseFloat(item.unitPrice) || 0)
    }));

    const subtotal = processedItems.reduce((sum: number, item: any) => sum + item.total, 0);
    const taxRate = parseFloat(tax) || 0;
    const discountAmount = parseFloat(discount) || 0; // flat discount
    const taxAmount = (subtotal * taxRate) / 100;
    const grandTotal = subtotal + taxAmount - discountAmount;

    const newInvoice = {
      invoiceNumber,
      issueDate: issueDate || '',
      dueDate: dueDate || '',
      clientId,
      projectId: projectId || null,
      currency: currency || 'USD',
      tax: taxRate,
      discount: discountAmount,
      paymentMethod: paymentMethod || 'Bank Transfer',
      notes: notes || '',
      items: processedItems,
      subtotal,
      taxAmount,
      discountAmount,
      grandTotal,
      status: status || 'Pending',
      createdAt: new Date(),
      deletedAt: null
    };

    const result = await db.collection('invoices').insertOne(newInvoice);
    return res.status(201).json({ _id: result.insertedId, ...newInvoice });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

router.put('/invoices/:id', requireAdmin, async (req: Request, res: Response) => {
  try {
    const db = getDb();
    const id = req.params.id;
    const updateData = { ...req.body };
    delete updateData._id;

    if (updateData.items) {
      updateData.items = updateData.items.map((item: any) => ({
        description: item.description || '',
        quantity: parseFloat(item.quantity) || 0,
        unitPrice: parseFloat(item.unitPrice) || 0,
        total: (parseFloat(item.quantity) || 0) * (parseFloat(item.unitPrice) || 0)
      }));

      const subtotal = updateData.items.reduce((sum: number, item: any) => sum + item.total, 0);
      const taxRate = parseFloat(updateData.tax) !== undefined ? parseFloat(updateData.tax) : 0;
      const discountAmount = parseFloat(updateData.discount) !== undefined ? parseFloat(updateData.discount) : 0;
      const taxAmount = (subtotal * taxRate) / 100;
      
      updateData.subtotal = subtotal;
      updateData.taxAmount = taxAmount;
      updateData.discountAmount = discountAmount;
      updateData.grandTotal = subtotal + taxAmount - discountAmount;
    } else {
      // Recalculate if tax or discount changes
      const currentInvoice = await db.collection('invoices').findOne({ _id: new ObjectId(id) });
      if (currentInvoice) {
        const subtotal = currentInvoice.subtotal;
        const taxRate = updateData.tax !== undefined ? parseFloat(updateData.tax) : currentInvoice.tax;
        const discountAmount = updateData.discount !== undefined ? parseFloat(updateData.discount) : currentInvoice.discount;
        const taxAmount = (subtotal * taxRate) / 100;
        
        updateData.taxAmount = taxAmount;
        updateData.discountAmount = discountAmount;
        updateData.grandTotal = subtotal + taxAmount - discountAmount;
      }
    }

    const result = await db.collection('invoices').findOneAndUpdate(
      { _id: new ObjectId(id), deletedAt: null },
      { $set: updateData },
      { returnDocument: 'after' }
    );

    if (!result) {
      return res.status(404).json({ error: 'Invoice not found' });
    }

    return res.json(result);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

router.delete('/invoices/:id', requireAdmin, async (req: Request, res: Response) => {
  try {
    const db = getDb();
    const id = req.params.id;

    const result = await db.collection('invoices').findOneAndUpdate(
      { _id: new ObjectId(id), deletedAt: null },
      { $set: { deletedAt: new Date() } }
    );

    if (!result) {
      return res.status(404).json({ error: 'Invoice not found' });
    }

    return res.json({ message: 'Invoice soft-deleted successfully' });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});


// --- PAYMENTS CRUD ---

router.get('/payments', requireAdmin, async (req: Request, res: Response) => {
  try {
    const db = getDb();
    const query: any = { deletedAt: null };

    const payments = await db.collection('payments')
      .aggregate([
        { $match: query },
        {
          $addFields: {
            clientIdObj: {
              $cond: {
                if: { $and: [{ $ne: ["$clientId", ""] }, { $ne: ["$clientId", null] }] },
                then: { $toObjectId: "$clientId" },
                else: null
              }
            },
            invoiceIdObj: {
              $cond: {
                if: { $and: [{ $ne: ["$invoiceId", ""] }, { $ne: ["$invoiceId", null] }] },
                then: { $toObjectId: "$invoiceId" },
                else: null
              }
            }
          }
        },
        {
          $lookup: {
            from: 'clients',
            localField: 'clientIdObj',
            foreignField: '_id',
            as: 'clientDetails'
          }
        },
        {
          $unwind: {
            path: '$clientDetails',
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $lookup: {
            from: 'invoices',
            localField: 'invoiceIdObj',
            foreignField: '_id',
            as: 'invoiceDetails'
          }
        },
        {
          $unwind: {
            path: '$invoiceDetails',
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $project: {
            clientIdObj: 0,
            invoiceIdObj: 0
          }
        }
      ]).toArray();

    return res.json(payments);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

router.post('/payments', requireAdmin, async (req: Request, res: Response) => {
  try {
    const db = getDb();
    const { invoiceId, clientId, amount, method, transactionId, date, notes } = req.body;

    if (!amount || !date) {
      return res.status(400).json({ error: 'Amount and Date are required' });
    }

    const newPayment = {
      invoiceId: invoiceId || null,
      clientId: clientId || null,
      amount: parseFloat(amount),
      method: method || 'Bank Transfer',
      transactionId: transactionId || '',
      date,
      notes: notes || '',
      createdAt: new Date(),
      deletedAt: null
    };

    const result = await db.collection('payments').insertOne(newPayment);

    // Automatically update invoice status if invoiceId is provided
    if (invoiceId) {
      const invoice = await db.collection('invoices').findOne({ _id: new ObjectId(invoiceId) });
      if (invoice) {
        // Find total payments made for this invoice
        const invoicePayments = await db.collection('payments')
          .find({ invoiceId, deletedAt: null })
          .toArray();
        
        const totalPaid = invoicePayments.reduce((sum: number, p: any) => sum + p.amount, 0);

        let newStatus = 'Pending';
        if (totalPaid >= invoice.grandTotal) {
          newStatus = 'Paid';
        } else if (totalPaid > 0) {
          newStatus = 'Partial';
        }

        await db.collection('invoices').updateOne(
          { _id: new ObjectId(invoiceId) },
          { $set: { status: newStatus } }
        );
      }
    }

    return res.status(201).json({ _id: result.insertedId, ...newPayment });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

router.put('/payments/:id', requireAdmin, async (req: Request, res: Response) => {
  try {
    const db = getDb();
    const id = req.params.id;
    const updateData = { ...req.body };
    delete updateData._id;

    if (updateData.amount) updateData.amount = parseFloat(updateData.amount);

    const result = await db.collection('payments').findOneAndUpdate(
      { _id: new ObjectId(id), deletedAt: null },
      { $set: updateData },
      { returnDocument: 'after' }
    );

    if (!result) {
      return res.status(404).json({ error: 'Payment record not found' });
    }

    return res.json(result);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

router.delete('/payments/:id', requireAdmin, async (req: Request, res: Response) => {
  try {
    const db = getDb();
    const id = req.params.id;

    const result = await db.collection('payments').findOneAndUpdate(
      { _id: new ObjectId(id), deletedAt: null },
      { $set: { deletedAt: new Date() } }
    );

    if (!result) {
      return res.status(404).json({ error: 'Payment record not found' });
    }

    return res.json({ message: 'Payment record soft-deleted successfully' });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});


// --- EXPENSES CRUD ---

router.get('/expenses', requireAdmin, async (req: Request, res: Response) => {
  try {
    const db = getDb();
    const query: any = { deletedAt: null };
    const expenses = await db.collection('expenses').find(query).toArray();
    return res.json(expenses);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

router.post('/expenses', requireAdmin, async (req: Request, res: Response) => {
  try {
    const db = getDb();
    const { description, category, amount, currency, date, notes } = req.body;

    if (!description || !category || !amount || !date) {
      return res.status(400).json({ error: 'Description, Category, Amount, and Date are required' });
    }

    const newExpense = {
      description,
      category,
      amount: parseFloat(amount),
      currency: currency || 'USD',
      date,
      notes: notes || '',
      createdAt: new Date(),
      deletedAt: null
    };

    const result = await db.collection('expenses').insertOne(newExpense);
    return res.status(201).json({ _id: result.insertedId, ...newExpense });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

router.put('/expenses/:id', requireAdmin, async (req: Request, res: Response) => {
  try {
    const db = getDb();
    const id = req.params.id;
    const updateData = { ...req.body };
    delete updateData._id;

    if (updateData.amount) updateData.amount = parseFloat(updateData.amount);

    const result = await db.collection('expenses').findOneAndUpdate(
      { _id: new ObjectId(id), deletedAt: null },
      { $set: updateData },
      { returnDocument: 'after' }
    );

    if (!result) {
      return res.status(404).json({ error: 'Expense not found' });
    }

    return res.json(result);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

router.delete('/expenses/:id', requireAdmin, async (req: Request, res: Response) => {
  try {
    const db = getDb();
    const id = req.params.id;

    const result = await db.collection('expenses').findOneAndUpdate(
      { _id: new ObjectId(id), deletedAt: null },
      { $set: { deletedAt: new Date() } }
    );

    if (!result) {
      return res.status(404).json({ error: 'Expense not found' });
    }

    return res.json({ message: 'Expense soft-deleted successfully' });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});


// --- SETTINGS ---

router.get('/settings', requireAdmin, async (req: Request, res: Response) => {
  try {
    const db = getDb();
    const settings = await db.collection('settings').findOne({});
    return res.json(settings);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

router.put('/settings', requireAdmin, async (req: Request, res: Response) => {
  try {
    const db = getDb();
    const updateData = { ...req.body };
    delete updateData._id;

    const result = await db.collection('settings').findOneAndUpdate(
      {},
      { $set: updateData },
      { upsert: true, returnDocument: 'after' }
    );

    return res.json(result);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});


// --- GLOBAL SEARCH ---

router.get('/search', requireAdmin, async (req: Request, res: Response) => {
  try {
    const db = getDb();
    const queryStr = (req.query.q as string) || '';

    if (!queryStr) {
      return res.json({ clients: [], projects: [], invoices: [], payments: [] });
    }

    const regex = { $regex: queryStr, $options: 'i' };

    const clients = await db.collection('clients')
      .find({
        deletedAt: null,
        $or: [{ name: regex }, { company: regex }, { email: regex }]
      })
      .limit(5)
      .toArray();

    const projects = await db.collection('projects')
      .find({
        deletedAt: null,
        $or: [{ projectName: regex }, { description: regex }]
      })
      .limit(5)
      .toArray();

    const invoices = await db.collection('invoices')
      .find({
        deletedAt: null,
        $or: [{ invoiceNumber: regex }, { notes: regex }]
      })
      .limit(5)
      .toArray();

    const payments = await db.collection('payments')
      .find({
        deletedAt: null,
        $or: [{ transactionId: regex }, { notes: regex }]
      })
      .limit(5)
      .toArray();

    return res.json({ clients, projects, invoices, payments });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});


// --- DASHBOARD ANALYTICS ---

router.get('/dashboard/stats', requireAdmin, async (req: Request, res: Response) => {
  try {
    const db = getDb();

    // 1. Total Clients
    const totalClients = await db.collection('clients').countDocuments({ deletedAt: null });

    // 2. Active Projects
    const activeProjects = await db.collection('projects').countDocuments({
      deletedAt: null,
      status: 'Active'
    });

    // 3. Completed Projects
    const completedProjects = await db.collection('projects').countDocuments({
      deletedAt: null,
      status: 'Completed'
    });

    // 4. Invoices and payments
    const invoices = await db.collection('invoices')
      .find({ deletedAt: null })
      .toArray();

    const payments = await db.collection('payments')
      .find({ deletedAt: null })
      .toArray();

    const totalRevenue = payments.reduce((sum, p) => sum + p.amount, 0);

    const pendingPaymentsCount = invoices.filter(inv => inv.status === 'Pending' || inv.status === 'Partial').length;

    // Outstanding amount = Grand Total of all unpaid/partially paid invoices minus what has already been paid for them
    let outstandingAmount = 0;
    for (const inv of invoices) {
      if (inv.status !== 'Paid') {
        const invPayments = payments.filter(p => p.invoiceId === inv._id.toString());
        const invPaid = invPayments.reduce((sum, p) => sum + p.amount, 0);
        outstandingAmount += Math.max(0, inv.grandTotal - invPaid);
      }
    }

    const settings = await db.collection('settings').findOne({});
    const currency = settings?.currency || 'USD';

    return res.json({
      totalClients,
      activeProjects,
      completedProjects,
      pendingPayments: pendingPaymentsCount,
      revenue: totalRevenue,
      outstandingAmount,
      currency
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

router.get('/dashboard/charts', requireAdmin, async (req: Request, res: Response) => {
  try {
    const db = getDb();

    // Monthly revenue (for last 6 months)
    const payments = await db.collection('payments')
      .find({ deletedAt: null })
      .toArray();

    const monthlyRevenueMap: { [key: string]: number } = {};
    const monthlyExpensesMap: { [key: string]: number } = {};

    payments.forEach(p => {
      // Expecting date as YYYY-MM-DD
      const month = p.date.substring(0, 7); // YYYY-MM
      monthlyRevenueMap[month] = (monthlyRevenueMap[month] || 0) + p.amount;
    });

    const expenses = await db.collection('expenses')
      .find({ deletedAt: null })
      .toArray();

    expenses.forEach(e => {
      const month = e.date.substring(0, 7); // YYYY-MM
      monthlyExpensesMap[month] = (monthlyExpensesMap[month] || 0) + e.amount;
    });

    // Sort months
    const allMonths = Array.from(new Set([
      ...Object.keys(monthlyRevenueMap),
      ...Object.keys(monthlyExpensesMap)
    ])).sort().slice(-6); // last 6 months

    const monthlyRevenue = allMonths.map(month => ({
      month,
      revenue: monthlyRevenueMap[month] || 0,
      expense: monthlyExpensesMap[month] || 0,
      profit: (monthlyRevenueMap[month] || 0) - (monthlyExpensesMap[month] || 0)
    }));

    // Client growth (clients count grouped by creation date)
    const clients = await db.collection('clients')
      .find({ deletedAt: null })
      .toArray();

    const clientGrowthMap: { [key: string]: number } = {};
    clients.forEach(c => {
      const date = c.createdAt ? new Date(c.createdAt).toISOString().substring(0, 7) : 'Unknown';
      clientGrowthMap[date] = (clientGrowthMap[date] || 0) + 1;
    });

    const sortedClientMonths = Object.keys(clientGrowthMap).sort().slice(-6);
    let runningTotal = 0;
    const clientGrowth = sortedClientMonths.map(month => {
      runningTotal += clientGrowthMap[month];
      return {
        month,
        count: runningTotal
      };
    });

    // Invoice Status count
    const invoices = await db.collection('invoices')
      .find({ deletedAt: null })
      .toArray();

    const invoiceStatus = { Paid: 0, Pending: 0, Partial: 0, Overdue: 0 };
    invoices.forEach(inv => {
      const status = inv.status as keyof typeof invoiceStatus;
      if (invoiceStatus[status] !== undefined) {
        invoiceStatus[status]++;
      }
    });

    // Project Status count
    const projects = await db.collection('projects')
      .find({ deletedAt: null })
      .toArray();

    const projectStatus = { Planning: 0, Active: 0, Revision: 0, Completed: 0, Cancelled: 0 };
    projects.forEach(p => {
      const status = p.status as keyof typeof projectStatus;
      if (projectStatus[status] !== undefined) {
        projectStatus[status]++;
      }
    });

    return res.json({
      monthlyRevenue,
      clientGrowth,
      invoiceStatus,
      projectStatus
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// --- WORKING PROJECTS CRUD ---

router.get('/working-projects', async (req: Request, res: Response) => {
  try {
    const db = getDb();
    const projects = await db.collection('workingProjects')
      .find({ deletedAt: null })
      .sort({ createdAt: -1 })
      .toArray();
    return res.json(projects);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

router.post('/working-projects', requireAdmin, async (req: Request, res: Response) => {
  try {
    const db = getDb();
    const { title, description, category, tags, progress, status, githubLink, liveUrl } = req.body;
    
    const newProject = {
      title,
      description,
      category,
      tags: Array.isArray(tags) ? tags : [],
      progress: parseInt(progress) || 0,
      status: status || 'In Progress',
      githubLink: githubLink || '',
      liveUrl: liveUrl || '',
      createdAt: new Date(),
      deletedAt: null
    };

    const result = await db.collection('workingProjects').insertOne(newProject);
    return res.status(201).json({ ...newProject, _id: result.insertedId });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

router.put('/working-projects/:id', requireAdmin, async (req: Request, res: Response) => {
  try {
    const db = getDb();
    const { id } = req.params;
    const { title, description, category, tags, progress, status, githubLink, liveUrl } = req.body;
    
    const updateData = {
      title,
      description,
      category,
      tags: Array.isArray(tags) ? tags : [],
      progress: parseInt(progress) || 0,
      status: status || 'In Progress',
      githubLink: githubLink || '',
      liveUrl: liveUrl || '',
      updatedAt: new Date()
    };

    const result = await db.collection('workingProjects').findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updateData },
      { returnDocument: 'after' }
    );

    if (!result) {
      return res.status(404).json({ error: 'Project not found' });
    }
    return res.json(result);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

router.delete('/working-projects/:id', requireAdmin, async (req: Request, res: Response) => {
  try {
    const db = getDb();
    const { id } = req.params;
    const result = await db.collection('workingProjects').findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { deletedAt: new Date() } }
    );
    if (!result) {
      return res.status(404).json({ error: 'Project not found' });
    }
    return res.json({ message: 'Project deleted successfully' });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// --- CONTRIBUTIONS CRUD ---

router.post('/contributions', async (req: Request, res: Response) => {
  try {
    const db = getDb();
    const { name, email, projectTitle, projectType, contributionType, message, githubProfile } = req.body;
    
    if (!name || !email || !projectTitle || !message) {
      return res.status(400).json({ error: 'Name, email, project title, and message are required.' });
    }

    const newContribution = {
      name,
      email,
      projectTitle,
      projectType, // 'live' or 'working'
      contributionType: contributionType || 'Code',
      message,
      githubProfile: githubProfile || '',
      createdAt: new Date(),
      status: 'Pending',
      deletedAt: null
    };

    const result = await db.collection('contributions').insertOne(newContribution);
    return res.status(201).json({ ...newContribution, _id: result.insertedId });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

router.get('/contributions', requireAdmin, async (req: Request, res: Response) => {
  try {
    const db = getDb();
    const list = await db.collection('contributions')
      .find({ deletedAt: null })
      .sort({ createdAt: -1 })
      .toArray();
    return res.json(list);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

router.put('/contributions/:id', requireAdmin, async (req: Request, res: Response) => {
  try {
    const db = getDb();
    const { id } = req.params;
    const { status } = req.body;

    const result = await db.collection('contributions').findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { status, updatedAt: new Date() } },
      { returnDocument: 'after' }
    );

    if (!result) {
      return res.status(404).json({ error: 'Contribution not found' });
    }
    return res.json(result);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

router.delete('/contributions/:id', requireAdmin, async (req: Request, res: Response) => {
  try {
    const db = getDb();
    const { id } = req.params;

    const result = await db.collection('contributions').findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { deletedAt: new Date() } }
    );

    if (!result) {
      return res.status(404).json({ error: 'Contribution not found' });
    }
    return res.json({ message: 'Contribution deleted successfully' });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

export default router;
